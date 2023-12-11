import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { PoolDetail } from './types/pool.types'
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
}
