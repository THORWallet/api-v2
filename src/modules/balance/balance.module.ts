import { Module } from '@nestjs/common'
import { BalanceController } from './balance.controller'
import { BalanceService } from './balance.service'
import { HttpModule } from '@nestjs/axios'
import { EthplorerHttpConfigService } from '../api/ethplorer-api.service'

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: EthplorerHttpConfigService,
    }),
  ],
  providers: [BalanceService],
  controllers: [BalanceController],
  exports: [],
})
export class BalanceModule {}
