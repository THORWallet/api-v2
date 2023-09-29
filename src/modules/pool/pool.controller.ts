import { Controller, Get } from '@nestjs/common'
import { PoolService } from './pool.service'

@Controller('pools')
export class PoolController {
  constructor(private readonly poolService: PoolService) {}

  @Get('thorchain')
  async pools() {
    return this.poolService.getThorchainMidgardPools()
  }
}
