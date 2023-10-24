import { Controller, Get } from '@nestjs/common'
import { StatsService } from './stats.service'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Stats, StatsData } from './types/stats.type'

@Controller('stats')
@ApiTags('Stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('/tc')
  @ApiOperation({
    summary: 'Get tc stats.',
  })
  @ApiResponse({ status: 200, description: 'Success', type: StatsData })
  async getTcStats(): Promise<StatsData> {
    return this.statsService.getTcStats()
  }

  @Get('/maya')
  @ApiOperation({
    summary: 'Get maya stats.',
  })
  @ApiResponse({ status: 200, description: 'Success', type: StatsData })
  async getMayaStats(): Promise<StatsData> {
    return this.statsService.getMayaStats()
  }

  @Get()
  @ApiOperation({
    summary: 'Get stats.',
  })
  @ApiResponse({ status: 200, description: 'Success', type: Stats })
  async getStats(): Promise<Stats> {
    return this.statsService.getStats()
  }
}
