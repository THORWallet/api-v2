import { Module } from '@nestjs/common'
import { AssetModule } from './modules/asset/asset.module'
import { CommandModule } from 'nestjs-command'
import { DbModule } from './modules/db/db.module'
import { Cache } from './modules/cache/cache.module'
import { PoolModule } from './modules/pool/pool.module'
import { InsertAssetsCommand } from './commands/assets/insert-assets-to-db'

@Module({
  imports: [DbModule, AssetModule, CommandModule, Cache, PoolModule],
  providers: [InsertAssetsCommand],
})
export class AppModule {}
