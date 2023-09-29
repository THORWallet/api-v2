import { Module } from '@nestjs/common'
import { AssetModule } from './modules/asset/asset.module'
import { CommandModule } from 'nestjs-command'
import { DbModule } from './modules/db/db.module'
import { GenerateAssetsCommand } from './commands/assets/generate-assets.command'
import { Cache } from './modules/cache/cache.module'
import { PoolModule } from './modules/pool/pool.module'

@Module({
  imports: [DbModule, AssetModule, CommandModule, Cache, PoolModule],
  providers: [GenerateAssetsCommand],
})
export class AppModule {}
