import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { EthereumGasService } from './ethereum.gas.service'
import { BitcoinGasService } from './bitcoin.gas.service'
import { GasResponse, GetGasDto } from '../entities'
import { Chain } from '../../../constants'

@Injectable()
export class GasService {
  constructor(
    private readonly ethGasService: EthereumGasService,
    private readonly btcGasService: BitcoinGasService,
  ) {}

  async getGasFee(getGasDto: GetGasDto): Promise<GasResponse> {
    switch (getGasDto.asset.chain) {
      case Chain.Ethereum:
        return this.ethGasService.getGasFee(getGasDto)
      case Chain.Bitcoin:
        return this.btcGasService.getGasFee(getGasDto)
      default:
        throw new HttpException(`${getGasDto.asset.chain} is not supported.`, HttpStatus.BAD_REQUEST)
    }
  }
}
