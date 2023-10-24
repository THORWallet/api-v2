import { Controller, Get } from '@nestjs/common'
import { PoolService } from './pool.service'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { PoolDetail } from './types/pool.types'

@Controller('pools')
@ApiTags('Pools')
export class PoolController {
  constructor(private readonly poolService: PoolService) {}

  @Get('thorchain')
  @ApiOperation({
    summary: 'Get tc pool details.',
  })
  @ApiResponse({ status: 200, description: 'Success', type: [PoolDetail] })
  async getTcPools() {
    return this.poolService.getThorchainMidgardPools()
  }

  @Get('maya')
  @ApiOperation({
    summary: 'Get maya pool details.',
  })
  @ApiResponse({ status: 200, description: 'Success', type: [PoolDetail] })
  async getMayaPools() {
    return this.poolService.getMayaMidgardPools()
  }
}
