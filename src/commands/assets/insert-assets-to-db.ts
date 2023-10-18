import { Command } from 'nestjs-command'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PoolAsset } from '../../modules/asset/entities/pool-asset.entity'
import { Repository } from 'typeorm'
import { AssetService } from '../../modules/asset/asset.service'

@Injectable()
export class InsertAssetsCommand {
  constructor(
    @InjectRepository(PoolAsset) private poolAssetRepository: Repository<PoolAsset>,
    private readonly assetService: AssetService,
  ) {}

  @Command({ command: 'insert-pool-assets' })
  async insert(): Promise<void> {
    try {
      const assets = await this.assetService.getAssets()
      const inserts = assets.map((asset) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _id, ...rest } = asset
        return rest
      })
      await this.poolAssetRepository.insert(inserts)
    } catch (e) {
      console.log('Error during pool asset inserts: ', { e })
    }
  }
}
