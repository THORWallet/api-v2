import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common'
import { PoolService } from './pool.service'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { PoolDetail } from './types/pool.types'
import { PoolKpis } from './types/poolKpis.types'

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

  @Get('member/thorchain/:address/:pool')
  @ApiOperation({
    summary: 'Get THORChain LP KPIs for the given pool.',
  })
  @ApiResponse({ status: 200, description: 'Success', type: PoolKpis })
  async getTcPoolMemberKpis(@Param('address') address: string, @Param('pool') pool: string): Promise<PoolKpis> {
    const member = await this.poolService.getThorchainMemberKpis(address, pool)
    if (!member) throw new HttpException(`Member not found.`, HttpStatus.NOT_FOUND)
    return member
  }
}
