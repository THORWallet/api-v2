import { Module } from '@nestjs/common'
import { AssetModule } from './modules/asset/asset.module'
import { CommandModule } from 'nestjs-command'
import { DbModule } from './modules/db/db.module'
import { Cache } from './modules/cache/cache.module'
import { PoolModule } from './modules/pool/pool.module'
import { InsertAssetsCommand } from './commands/assets/insert-assets-to-db'
import { ConfigModule } from '@nestjs/config'
import config from './modules/config/config'
import { BalanceModule } from './modules/balance/balance.module'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { CACHE_TIME } from './constants'
import { StatsModule } from './modules/stats/stats.module'
import { PriceModule } from './modules/price/price.module'
import { APP_GUARD } from '@nestjs/core'
import { GasModule } from './modules/gas/gas.module'
import { QuoteModule } from './modules/quote/quote.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    //TODO: config this
    ThrottlerModule.forRoot([
      {
        ttl: 2 * CACHE_TIME.minute,
        limit: 1000,
      },
    ]),
    DbModule,
    AssetModule,
    CommandModule,
    Cache,
    PoolModule,
    BalanceModule,
    StatsModule,
    PriceModule,
    GasModule,
    QuoteModule,
  ],
  providers: [
    InsertAssetsCommand,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
