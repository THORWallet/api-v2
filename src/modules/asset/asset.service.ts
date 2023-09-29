import { Injectable } from '@nestjs/common'
import { Asset } from './entities/asset.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import axios from 'axios'
import { PoolDetail } from '../pool/types/pool.types'
import { tickers, tokens } from '../../constants'

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(Asset)
    private assetRepository: Repository<Asset>,
  ) {}

  async getPoolAssets(): Promise<Asset[]> {
    const { data: thorchainPools } = await axios.get<PoolDetail[]>('https://midgard.thorwallet.org/v2/pools')
    const poolsAsAssets: Asset[] = thorchainPools.map((pool) => {
      const [chain, ticker] = pool.asset.split('.')
      const [tickerName, contractAddress] = ticker.split('-')
      const tickerData = tickers.find((t) => t.ticker === tickerName)

      return {
        id: 1,
        chain,
        ticker,
        icon: tickerData?.icon || '',
        name: tickerData?.name || '',
        decimals: 0,
        contractAddress: contractAddress || '',
      }
    })

    const assetFromTokens: Asset[] = tokens.map(({ chain, contractAddress, decimals, icon, name, ticker }) => ({
      chain,
      contractAddress,
      decimals,
      icon,
      name,
      ticker,
      id: 1,
    }))

    const poolsWithTokens: Asset[] = [...poolsAsAssets, ...assetFromTokens]
    return poolsWithTokens
  }

  getAssets(): Promise<Asset[]> {
    return this.getPoolAssets()
  }

  getAssetsFromDb(): Promise<Asset[]> {
    return this.assetRepository.find()
  }
}
