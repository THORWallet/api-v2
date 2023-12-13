import { Module } from '@nestjs/common'
import { PriceService } from './price.service'
import { PriceController } from './price.controller'
import { PoolService } from '../pool/pool.service'

@Module({
  controllers: [PriceController],
  providers: [PriceService, PoolService],
  exports: [PriceService],
})
export class PriceModule {}
