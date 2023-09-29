import { Command } from 'nestjs-command'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Asset } from '../../modules/asset/entities/asset.entity'
import { Repository } from 'typeorm'
import { AssetService } from '../../modules/asset/asset.service'

@Injectable()
export class InsertAssetsCommand {
  constructor(
    @InjectRepository(Asset) private assetRepository: Repository<Asset>,
    private readonly assetService: AssetService,
  ) {}

  @Command({ command: 'insert-assets' })
  async insert(): Promise<void> {
    const assets = await this.assetService.getAssets()

    const inserts = assets.map((asset) => {
      const { id, ...rest } = asset

      this.assetRepository.insert(rest)
    })

    await Promise.all(inserts)
  }
}
