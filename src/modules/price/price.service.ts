import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Asset } from '@xchainjs/xchain-util'
import axios from 'axios'
import { CACHE_TIME, tickers } from '../../constants'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { PRICE_CACHE } from './cache-keys/price.cache-keys'
import { PriceHistoryResponse } from './types'

@Injectable()
export class PriceService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
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

  fetchPricesFromCoingecko = async (assets: Asset[]): Promise<Record<string, number>> => {
    const mappedTickers = assets.map(({ ticker }) => this.mapTickerToCoinGeckoId(ticker)).join(',')

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

  fetchPriceHistoryFromCoinGecko = async ({
    ticker,
    days = 7,
  }: {
    ticker: string
    days?: number
  }): Promise<PriceHistoryResponse> => {
    const tickerToUse = ticker.split('.')[1] || null

    if (!tickerToUse) {
      throw new Error('Invalid ticker')
    }

    const coingeckoId = this.mapTickerToCoinGeckoId(tickerToUse)
    const { data: currentPriceData } = await axios.get(
      `${this.configService.get('COINGECKO_API_URL')}simple/price?ids=${coingeckoId}&vs_currencies=usd`,
    )
    const currentPrice = currentPriceData[coingeckoId].usd

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
    }

    return responseObject
  }
}
