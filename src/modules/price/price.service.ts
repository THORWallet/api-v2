import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Asset } from '@xchainjs/xchain-util'
import axios from 'axios'
import { CACHE_TIME, tickers } from '../../constants'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { PRICE_CACHE } from './cache-keys/price.cache-keys'

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
    const cachedData = this.cacheManager.get<Record<string, number>>(PRICE_CACHE.coingeckoAssets(mappedTickers))
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
}
