import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { EthGasResponse, GetGasDto } from './entities/get-gas.dto'
import { EthereumGasService } from './services/ethereum.gas.service'
import { Chain } from '../../constants'

@Controller('gas')
@ApiTags('Gas')
export class GasController {
  constructor(private readonly ethGasService: EthereumGasService) {}

  @Post()
  @ApiOperation({
    summary: 'Get gas fee for asset action',
  })
  @ApiBody({ type: GetGasDto })
  @ApiResponse({ status: 200, description: 'Success', type: EthGasResponse })
  async gas(@Body() getGasDto: GetGasDto): Promise<EthGasResponse> {
    switch (getGasDto.asset.chain) {
      case Chain.Ethereum:
        return this.ethGasService.getGasFee(getGasDto)
      default:
        throw new HttpException(`${getGasDto.asset.chain} is not supported.`, HttpStatus.BAD_REQUEST)
    }
  }
}
