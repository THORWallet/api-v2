import { Module } from '@nestjs/common'
import { PoolService } from './pool.service'
import { PoolController } from './pool.controller'

@Module({
  providers: [PoolService],
  exports: [PoolService],
  controllers: [PoolController],
})
export class PoolModule {}
