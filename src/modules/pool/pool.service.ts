import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { PoolDetail } from './types/pool.types'
import axios from 'axios'
import { POOL_KEYS } from './cache-keys/pool.cache-keys'
import { CACHE_TIME } from '../../constants'

@Injectable()
export class PoolService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  getThorchainMidgardPools = async (): Promise<PoolDetail[]> => {
    const tcMidgardPool = await this.cacheManager.get<PoolDetail[]>(POOL_KEYS.tcMidgardPool)
    if (tcMidgardPool) {
      return tcMidgardPool
    }

    const { data } = await axios.get<PoolDetail[]>('https://midgard.thorwallet.org/v2/pools')
    await this.cacheManager.set(POOL_KEYS.tcMidgardPool, data, CACHE_TIME.minute * 5)
    return data
  }
}
