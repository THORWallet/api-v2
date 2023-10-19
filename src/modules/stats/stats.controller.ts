import { Controller, Get } from '@nestjs/common'
import { StatsService } from './stats.service'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { StatsData } from './types/stats.type'

@Controller('stats')
@ApiTags('Stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('/tc')
  @ApiOperation({
    summary: 'Get tc stats.',
  })
  @ApiResponse({ status: 200, description: 'Success', type: [StatsData] })
  async getStats(): Promise<StatsData> {
    return this.statsService.getTcStats()
  }
}
