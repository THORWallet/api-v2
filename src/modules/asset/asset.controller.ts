import { Controller, Get, Inject } from '@nestjs/common'
import { AssetService } from './asset.service'
import { Asset } from './entities/asset.entity'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { ASSET_KEYS } from './cache-keys/asset.cache-keys'
import { CACHE_TIME } from '../../constants'

@Controller('assets')
export class AssetController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly assetService: AssetService,
  ) {}

  @Get()
  async getAssets(): Promise<Asset[]> {
    const assetsFromCache = await this.cacheManager.get<Asset[]>(ASSET_KEYS.assets)

    if (assetsFromCache) {
      return assetsFromCache
    }
    const assets = await this.assetService.getAssets()
    this.cacheManager.set(ASSET_KEYS.assets, assets, CACHE_TIME.hour)
    return assets
  }
}
