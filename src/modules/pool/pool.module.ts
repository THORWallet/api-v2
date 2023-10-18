import { Module } from '@nestjs/common'
import { PoolService } from './pool.service'
import { PoolController } from './pool.controller'
import { TcMidgardHttpConfigService } from '../api/tc-midgard.service'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: TcMidgardHttpConfigService,
    }),
  ],
  providers: [PoolService],
  exports: [PoolService],
  controllers: [PoolController],
})
export class PoolModule {}
