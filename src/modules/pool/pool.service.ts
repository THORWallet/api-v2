import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { PoolDetail } from './types/pool.types'
import { HttpService } from '@nestjs/axios'
import { POOL_KEYS } from './cache-keys/pool.cache-keys'
import { CACHE_TIME } from '../../constants'

@Injectable()
export class PoolService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly tcMidgardApi: HttpService,
  ) {}

  getThorchainMidgardPools = async (): Promise<PoolDetail[]> => {
    try {
      const tcMidgardPool = await this.cacheManager.get<PoolDetail[]>(POOL_KEYS.tcMidgardPool)
      if (tcMidgardPool) {
        return tcMidgardPool
      }

      const { data } = await this.tcMidgardApi.axiosRef.get<PoolDetail[]>('pools')
      await this.cacheManager.set(POOL_KEYS.tcMidgardPool, data, CACHE_TIME.minute * 5)
      return data
    } catch (e) {
      console.log(e)
    }
  }
}
