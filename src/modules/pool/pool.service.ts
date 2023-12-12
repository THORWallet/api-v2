import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { DepthAndPriceHistory, PoolDetail } from './types/pool.types'
import { POOL_KEYS } from './cache-keys/pool.cache-keys'
import { CACHE_TIME } from '../../constants'
import axios from 'axios'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class PoolService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  getThorchainMidgardPools = async (): Promise<PoolDetail[]> => {
    const tcMidgardPool = await this.cacheManager.get<PoolDetail[]>(POOL_KEYS.tcMidgardPool)
    if (tcMidgardPool) {
      return tcMidgardPool
    }

    const { data } = await axios.get<PoolDetail[]>(this.configService.get('PUBLIC_TC_MIDGARD_URL') + '/pools')
    await this.cacheManager.set(POOL_KEYS.tcMidgardPool, data, CACHE_TIME.minute * 5)
    return data
  }

  getMayaMidgardPools = async (): Promise<PoolDetail[]> => {
    const mayaMidgardPool = await this.cacheManager.get<PoolDetail[]>(POOL_KEYS.mayaMidgardPool)
    if (mayaMidgardPool) {
      return mayaMidgardPool
    }

    const { data } = await axios.get<PoolDetail[]>(this.configService.get('MAYA_MIDGARD_URL') + '/pools')
    await this.cacheManager.set(POOL_KEYS.mayaMidgardPool, data, CACHE_TIME.minute * 5)
    return data
  }

  getTcPoolDepthHistory = async ({ pool, count }: { pool: string; count: number }): Promise<DepthAndPriceHistory> => {
    const tcPoolHistory = await this.cacheManager.get<DepthAndPriceHistory>(POOL_KEYS.tcPoolHistory(pool, count))
    if (tcPoolHistory) {
      return tcPoolHistory
    }

    const { data } = await axios.get<DepthAndPriceHistory>(
      this.configService.get('PUBLIC_TC_MIDGARD_URL') + `/history/depths/${pool}`,
      { params: { interval: 'day', count } },
    )

    await this.cacheManager.set(POOL_KEYS.tcPoolHistory(pool, count), data, CACHE_TIME.minute * 5)
    return data
  }

  getMayaPoolDepthHistory = async ({ pool, count }: { pool: string; count: number }): Promise<DepthAndPriceHistory> => {
    const mayaPoolHistory = await this.cacheManager.get<DepthAndPriceHistory>(POOL_KEYS.mayaPoolHistory(pool, count))
    if (mayaPoolHistory) {
      return mayaPoolHistory
    }

    const { data } = await axios.get<DepthAndPriceHistory>(
      this.configService.get('MAYA_MIDGARD_URL') + `/history/depths/${pool}`,
      { params: { interval: 'day', count } },
    )

    await this.cacheManager.set(POOL_KEYS.mayaPoolHistory(pool, count), data, CACHE_TIME.minute * 5)
    return data
  }
}
