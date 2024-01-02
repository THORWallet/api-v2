import { Inject, Injectable } from '@nestjs/common'
import { MimirStats, Stats, StatsData } from './types/stats.type'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { STATS_KEYS } from './cache-keys/stats.cache-keys'
import { CACHE_TIME } from '../../constants'

@Injectable()
export class StatsService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  async getTcStats(): Promise<StatsData> {
    const tcStats = await this.cacheManager.get<StatsData>(STATS_KEYS.tcStats)

    if (tcStats) {
      return tcStats
    }

    const { data } = await axios.get<StatsData>(this.configService.get('PUBLIC_TC_MIDGARD_URL') + '/stats')

    await this.cacheManager.set(STATS_KEYS.tcStats, data, CACHE_TIME.minute * 5)

    return data
  }

  async getMayaStats(): Promise<StatsData> {
    const mayaStats = await this.cacheManager.get<StatsData>(STATS_KEYS.mayaStats)

    if (mayaStats) {
      return mayaStats
    }

    const { data } = await axios.get<StatsData>(this.configService.get('MAYA_MIDGARD_URL') + '/stats')

    await this.cacheManager.set(STATS_KEYS.mayaStats, data, CACHE_TIME.minute * 5)

    return data
  }

  async getMayaMimirStats(): Promise<MimirStats> {
    const mayaStats = await this.cacheManager.get<MimirStats>(STATS_KEYS.mayaMimirStats)

    if (mayaStats) {
      return mayaStats
    }

    const { data } = await axios.get<MimirStats>(this.configService.get('MAYANODE_URL') + '/mayachain/mimir')

    await this.cacheManager.set(STATS_KEYS.mayaMimirStats, data, CACHE_TIME.minute * 5)

    return data
  }

  async getStats(): Promise<Stats> {
    return {
      thorchain: await this.getTcStats(),
      maya: await this.getMayaStats(),
    }
  }
}
