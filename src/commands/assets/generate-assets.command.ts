import { Command } from 'nestjs-command'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Asset } from '../../modules/asset/entities/asset.entity'
import { Repository } from 'typeorm'
import { TickerMap, Token } from './types'
import axios from 'axios'
import { ecosystems } from './helpers/helpers'
// import pLimit from 'p-limit'

@Injectable()
export class GenerateAssetsCommand {
  // private limit = pLimit(1)
  constructor(@InjectRepository(Asset) private assetRepository: Repository<Asset>) {}

  getTop2000Assets = async () => {
    const tickers: TickerMap[] = []
    for (let i = 1; i <= 1; i++) {
      const { data: response } = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&page=${i}`,
      )

      for (const data of response) {
        tickers.push({
          coingeckoId: data.id,
          icon: data.image,
          ticker: data.symbol.toUpperCase(),
          name: data.name,
        })
      }

      console.log(`Fetched top ${i * 100} coins`)
    }

    return tickers
  }

  topCoinsForEcosystem = async (category: string): Promise<Token[]> => {
    const { data: response, status } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=${category}&order=market_cap_desc&per_page=250&page=1&sparkline=false`,
    )

    if (status === 429) {
      await new Promise((resolve) => {
        setTimeout(resolve, 4000)
      })
      return this.topCoinsForEcosystem(category)
    }

    if (status === 404) {
      return []
    }

    return response
  }

  @Command({ command: 'generate-assets' })
  async generate(): Promise<void> {
    // const top2kTokens = await this.getTop2000Assets()

    // console.log({ topEcoTokens })

    const tokens = []

    for (const system of ecosystems) {
      const data = await this.topCoinsForEcosystem(system.category)
      tokens.push(data)
    }
    console.log('data: ', { tokens })
  }
}
