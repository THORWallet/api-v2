import { Controller, Get } from '@nestjs/common'
import { PoolService } from './pool.service'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { PoolDetail } from './types/pool.types'

@Controller('pools')
export class PoolController {
  constructor(private readonly poolService: PoolService) {}

  @Get('thorchain')
  @ApiOperation({
    summary: 'Get tc pool details.',
  })
  @ApiResponse({ status: 200, description: 'Success', type: [PoolDetail] })
  async pools() {
    return this.poolService.getThorchainMidgardPools()
  }
}
