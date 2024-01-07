import { Module } from '@nestjs/common'
import { QuoteController } from './quote.controller'
import { QuoteService } from './quote.service'
import { PoolService } from '../pool/pool.service'
import { StatsService } from '../stats/stats.service'

@Module({
  controllers: [QuoteController],
  providers: [QuoteService, PoolService, StatsService],
})
export class QuoteModule {}
