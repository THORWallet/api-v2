import { Module } from '@nestjs/common'
import { AssetModule } from './modules/asset/asset.module'
import { CommandModule } from 'nestjs-command'
import { DbModule } from './modules/db/db.module'
import { Cache } from './modules/cache/cache.module'
import { PoolModule } from './modules/pool/pool.module'
import { InsertAssetsCommand } from './commands/assets/insert-assets-to-db'
import { ConfigModule } from '@nestjs/config'
import config from './modules/config/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    DbModule,
    AssetModule,
    CommandModule,
    Cache,
    PoolModule,
  ],
  providers: [InsertAssetsCommand],
})
export class AppModule {}
