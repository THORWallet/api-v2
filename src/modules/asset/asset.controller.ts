import { Controller, Get, Inject } from '@nestjs/common'
import { AssetService } from './asset.service'
import { PoolAsset } from './entities/pool-asset.entity'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { ASSET_KEYS } from './cache-keys/asset.cache-keys'
import { CACHE_TIME } from '../../constants'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@Controller('assets')
@ApiTags('Assets')
export class AssetController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly assetService: AssetService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get Pool Assets from the Database',
    description: 'Retrieve a list of assets from the database.',
  })
  @ApiResponse({ status: 200, description: 'Success', type: [PoolAsset] })
  async getAssetsFromDb(): Promise<PoolAsset[]> {
    const assetsFromCache = await this.cacheManager.get<PoolAsset[]>(ASSET_KEYS.assets)

    if (assetsFromCache) {
      return assetsFromCache
    }
    const assets = await this.assetService.getAssetsFromDb()
    this.cacheManager.set(ASSET_KEYS.assets, assets, CACHE_TIME.hour)
    return assets
  }
}
