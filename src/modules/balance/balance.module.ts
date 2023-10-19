import { Module } from '@nestjs/common'
import { BalanceController } from './balance.controller'
import { BalanceService } from './balance.service'
import { HttpModule } from '@nestjs/axios'
import { EthplorerHttpConfigService } from '../api/ethplorer-api.service'
import { PoolService } from '../pool/pool.service'
import { StatsService } from '../stats/stats.service'

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: EthplorerHttpConfigService,
    }),
  ],
  providers: [BalanceService, PoolService, StatsService],
  controllers: [BalanceController],
  exports: [],
})
export class BalanceModule {}
