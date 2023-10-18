import { Injectable } from '@nestjs/common'
import { assetFromString } from '@xchainjs/xchain-util'
import { PoolAsset } from './entities/pool-asset.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PoolDetail } from '../pool/types/pool.types'
import { Chain, tickers } from '../../constants'
import { getDecimalsByAsset } from './asset.helpers'
import { HttpService } from '@nestjs/axios'

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(PoolAsset)
    private poolAssetRepository: Repository<PoolAsset>,
    private readonly tcMidgardApi: HttpService,
  ) {}

  async getPoolAssets(): Promise<any[]> {
    const { data: thorchainPools } = await this.tcMidgardApi.axiosRef.get<PoolDetail[]>('pools')
    const poolsAsAssets = thorchainPools.map((pool) => {
      const poolAsset = assetFromString(pool.asset)
      const { chain, ticker, symbol } = poolAsset
      const [tickerName, contractAddress] = symbol.split('-')
      const tickerData = tickers.find((t) => t.ticker === tickerName)
      const decimals = getDecimalsByAsset(poolAsset, contractAddress)
      return {
        id: 1,
        chain,
        ticker,
        icon: tickerData?.icon || '',
        name: tickerData?.name || '',
        decimals,
        contractAddress: chain === Chain.Avalanche || chain === Chain.Ethereum ? contractAddress || '' : '',
      }
    })

    return poolsAsAssets
  }

  getAssets(): Promise<PoolAsset[]> {
    return this.getPoolAssets()
  }

  getAssetsFromDb(): Promise<PoolAsset[]> {
    return this.poolAssetRepository.find()
  }
}
