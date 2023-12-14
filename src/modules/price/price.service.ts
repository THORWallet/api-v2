import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import { CACHE_TIME, tickers } from '../../constants'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { PRICE_CACHE } from './cache-keys/price.cache-keys'
import { PriceHistoryResponse, PriceHistorySource } from './types'
import { PoolService } from '../pool/pool.service'
import BigNumber from 'bignumber.js'
import { AssetCacaoNative, AssetRuneNative } from '../asset/asset.helpers'

@Injectable()
export class PriceService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly poolService: PoolService,
  ) {}

  mapTickerToCoinGeckoId = (ticker: string): string => {
    const found = tickers.find((d) => d.ticker === ticker.toUpperCase())
    if (found) {
      return found.coingeckoId
    }

    return ticker.toUpperCase()
  }

  mapCoingeckoIdToTicker = (coingeckoId: string): string => {
    const found = tickers.find((d) => d.coingeckoId === coingeckoId)
    if (found) {
      return found.ticker
    }

    return coingeckoId.toUpperCase()
  }

  fetchPricesFromCoingecko = async (tickers: string[]): Promise<Record<string, number>> => {
    const mappedTickers = tickers.map((ticker) => this.mapTickerToCoinGeckoId(ticker)).join(',')

    const cachedData = await this.cacheManager.get<Record<string, number>>(PRICE_CACHE.coingeckoAssets(mappedTickers))
    if (cachedData) {
      return cachedData
    }
    const { data } = await axios.get(
      `${this.configService.get('COINGECKO_API_URL')}simple/price?ids=${mappedTickers}&vs_currencies=usd`,
    )

    const result = Object.keys(data)
      .map((currency) => {
        const ticker = this.mapCoingeckoIdToTicker(currency)
        return [ticker, data[currency].usd]
      })
      .reduce((a, [key, value]) => {
        return {
          ...a,
          [key]: value,
        }
      }, {})
    await this.cacheManager.set(PRICE_CACHE.coingeckoAssets(mappedTickers), result, CACHE_TIME.minute * 5)
    return result
  }

  fetchPriceHistory = async ({ ticker, days }: { ticker: string; days: number }): Promise<PriceHistoryResponse> => {
    const tcPools = await this.poolService.getThorchainMidgardPools()
    const mayaPools = await this.poolService.getMayaMidgardPools()
    const isRune = ticker === `${AssetRuneNative.chain}.${AssetRuneNative.ticker}`
    const isCacao = ticker === `${AssetCacaoNative.chain}.${AssetCacaoNative.ticker}`
    const isTcAsset = tcPools.some((pool) => pool.asset.includes(ticker))
    const isMayaAsset =
      ticker !== `${AssetRuneNative.chain}.${AssetRuneNative.ticker}` &&
      mayaPools.some((pool) => pool.asset.includes(ticker))

    if (isMayaAsset || isTcAsset) {
      return this.fetchPriceHistoryFromMidgard({ ticker, days, isMayaAsset, isTcAsset })
    }

    if (isRune || isCacao) {
      return this.getCacaoOrRunePriceHistory({ isRune, isCacao, interval: days })
    }

    return this.fetchPriceHistoryFromCoinGecko({ ticker, days })
  }

  getCacaoOrRunePriceHistory = async ({
    isRune,
    isCacao,
    interval,
  }: {
    isRune: boolean
    isCacao: boolean
    interval: number
  }): Promise<PriceHistoryResponse> => {
    if (!isRune && !isCacao) {
      throw new HttpException('Invalid asset', HttpStatus.BAD_REQUEST)
    }

    const history =
      isRune && !isCacao
        ? await this.poolService.getTcTvlHistory({ count: interval })
        : await this.poolService.getMayaTvlHistory({ count: interval })

    const currentPrice = history.intervals[history.intervals.length - 1].runePriceUSD

    const priceBeforeCurrent = new BigNumber(history.intervals[history.intervals.length - 2].runePriceUSD)
    const priceChange24hUsd = new BigNumber(currentPrice).minus(priceBeforeCurrent)

    const priceChange24hPercentage = priceChange24hUsd.div(priceBeforeCurrent).times(100)
    console.log({ what: isRune ? PriceHistorySource.TC_MIDGARD : PriceHistorySource.MAYA_MIDGARD, isRune })
    return {
      id: isRune ? AssetRuneNative.ticker : AssetCacaoNative.ticker,
      name: isRune ? AssetRuneNative.ticker : AssetCacaoNative.ticker,
      priceChange24hUsd: priceChange24hUsd.toNumber(),
      priceChange24hPercentage: priceChange24hPercentage.gte(0)
        ? `+${priceChange24hPercentage.toFixed(2)}`
        : `${priceChange24hPercentage.toFixed(2)}`,
      history: history.intervals.map((i) => [
        new BigNumber(i.endTime).toNumber() * 1000,
        new BigNumber(i.runePriceUSD).toNumber(),
      ]),
      currentPriceInUsd: new BigNumber(history.intervals[history.intervals.length - 1].runePriceUSD).toNumber(),
      timeStamp: new Date().getTime(),
      source: isRune ? PriceHistorySource.TC_MIDGARD : PriceHistorySource.MAYA_MIDGARD,
    }
  }

  fetchPriceHistoryFromMidgard = async ({
    ticker,
    days,
    isMayaAsset,
    isTcAsset,
  }: {
    ticker: string
    days: number
    isMayaAsset: boolean
    isTcAsset: boolean
  }): Promise<PriceHistoryResponse> => {
    const poolHistory = isTcAsset
      ? await this.poolService.getTcPoolDepthHistory({ pool: ticker, count: days })
      : await this.poolService.getMayaPoolDepthHistory({ pool: ticker, count: days })

    const currentPrice = poolHistory.intervals[poolHistory.intervals.length - 1].assetPriceUSD

    const priceBeforeCurrent = new BigNumber(poolHistory.intervals[poolHistory.intervals.length - 2].assetPriceUSD)
    const priceChange24hUsd = new BigNumber(currentPrice).minus(priceBeforeCurrent)

    const priceChange24hPercentage = priceChange24hUsd.div(priceBeforeCurrent).times(100)

    const responseObject = {
      id: ticker,
      name: ticker,
      priceChange24hUsd: priceChange24hUsd.toNumber(),
      priceChange24hPercentage: priceChange24hPercentage.gte(0)
        ? `+${priceChange24hPercentage.toFixed(2)}`
        : `${priceChange24hPercentage.toFixed(2)}`,
      history: poolHistory.intervals.map((i) => [
        new BigNumber(i.endTime).toNumber() * 1000,
        new BigNumber(i.assetPriceUSD).toNumber(),
      ]),
      currentPriceInUsd: new BigNumber(currentPrice).toNumber(),
      timeStamp: new Date().getTime(),
      source: isMayaAsset ? PriceHistorySource.MAYA_MIDGARD : PriceHistorySource.TC_MIDGARD,
    }

    return responseObject
  }

  fetchPriceHistoryFromCoinGecko = async ({
    ticker,
    days = 7,
  }: {
    ticker: string
    days?: number
  }): Promise<PriceHistoryResponse> => {
    const tickerToUse = ticker.split('.')[1]
      ? ticker.split('.')[1].includes('-')
        ? ticker.split('.')[1].split('-')[0]
        : ticker.split('.')[1]
      : ticker.split('.')[1] || null

    if (!tickerToUse) {
      throw new HttpException(`${ticker} is not supported.`, HttpStatus.BAD_REQUEST)
    }

    const coingeckoId = this.mapTickerToCoinGeckoId(tickerToUse)

    const { data: currentPriceData } = await axios.get(
      `${this.configService.get('COINGECKO_API_URL')}simple/price?ids=${coingeckoId}&vs_currencies=usd`,
    )

    if (Object.keys(currentPriceData).length === 0) {
      throw new HttpException(`${ticker} is not supported.`, HttpStatus.BAD_REQUEST)
    }

    const currentPrice = currentPriceData[coingeckoId.toLowerCase()].usd

    const { data } = await axios.get(
      `${this.configService.get(
        'COINGECKO_API_URL',
      )}coins/${coingeckoId}/market_chart?vs_currency=usd&days=${days}&interval=daily`,
    )

    const priceChange24hUsd = currentPrice - data.prices[1][1]
    const priceChange24hPercentage = (priceChange24hUsd / data.prices[0][1]) * 100

    const responseObject = {
      id: coingeckoId,
      name: ticker,
      priceChange24hUsd,
      priceChange24hPercentage:
        priceChange24hPercentage >= 0
          ? `+${priceChange24hPercentage.toFixed(2)}`
          : `${priceChange24hPercentage.toFixed(2)}`,
      history: data.prices,
      currentPriceInUsd: currentPrice,
      timeStamp: new Date().getTime(),
      source: PriceHistorySource.COINGECKO,
    }

    return responseObject
  }
}
