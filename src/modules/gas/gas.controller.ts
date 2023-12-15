import { Body, Controller, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GasResponse, GetGasDto } from './entities/gas.dto'

import { GasService } from './services/gas.service'

@Controller('gas')
@ApiTags('Gas')
export class GasController {
  constructor(private readonly gasService: GasService) {}

  @Post()
  @ApiOperation({
    summary: 'Get gas fee for asset action',
  })
  @ApiBody({ type: GetGasDto })
  @ApiResponse({ status: 200, description: 'Success', type: GasResponse })
  async gas(@Body() getGasDto: GetGasDto): Promise<GasResponse> {
    return this.gasService.getGasFee(getGasDto)
  }
}
