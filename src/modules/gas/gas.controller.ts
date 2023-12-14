import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GasResponse, GetGasDto } from './entities/gas.dto'
import { EthereumGasService } from './services/ethereum.gas.service'
import { Chain } from '../../constants'
import { BitcoinGasService } from './services/bitcoin.gas.service'

@Controller('gas')
@ApiTags('Gas')
export class GasController {
  constructor(
    private readonly ethGasService: EthereumGasService,
    private readonly bitcoinGasService: BitcoinGasService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Get gas fee for asset action',
  })
  @ApiBody({ type: GetGasDto })
  @ApiResponse({ status: 200, description: 'Success', type: GasResponse })
  async gas(@Body() getGasDto: GetGasDto): Promise<GasResponse> {
    switch (getGasDto.asset.chain) {
      case Chain.Ethereum:
        return this.ethGasService.getGasFee(getGasDto)
      case Chain.Bitcoin:
        return this.bitcoinGasService.getGasFee(getGasDto)
      default:
        throw new HttpException(`${getGasDto.asset.chain} is not supported.`, HttpStatus.BAD_REQUEST)
    }
  }
}
