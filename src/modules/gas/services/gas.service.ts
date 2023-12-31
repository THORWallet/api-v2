import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { EthereumGasService } from './ethereum.gas.service'
import { BitcoinGasService } from './bitcoin.gas.service'
import { GasResponse, GetGasDto } from '../entities'
import { Chain } from '../../../constants'
import { BitcoinCashGasService } from './bitcoin-cash.service'
import { DogeGasService } from './doge.gas.service'
import { LitecoinGasService } from './litecoin.gas.service'
import { DashGasService } from './dash.gas.service'
import { AvaxGasService } from './avax.gas.service'
import { BscGasService } from './bsc.gas.service'
import { ThorchainGasService } from './thorchain.gas.service'
import { MayaGasService } from './maya.gas.service'
import { BnbGasService } from './bnb.gas.service'
import { AtomGasService } from './atom.gas.service'
import { KujiGasService } from './kuji.gas.service'

@Injectable()
export class GasService {
  constructor(
    private readonly ethGasService: EthereumGasService,
    private readonly btcGasService: BitcoinGasService,
    private readonly dogeGasService: DogeGasService,
    private readonly btcCashService: BitcoinCashGasService,
    private readonly liteCoinGasService: LitecoinGasService,
    private readonly dashGasService: DashGasService,
    private readonly avaxGasService: AvaxGasService,
    private readonly bscGasService: BscGasService,
    private readonly tcGasService: ThorchainGasService,
    private readonly mayaGasService: MayaGasService,
    private readonly bnbGasService: BnbGasService,
    private readonly atomGasService: AtomGasService,
    private readonly kujiGasService: KujiGasService,
  ) {}

  async getGasFee(getGasDto: GetGasDto): Promise<GasResponse> {
    switch (getGasDto.asset.chain) {
      case Chain.Ethereum:
        return this.ethGasService.getGasFee(getGasDto)
      case Chain.Bitcoin:
        return this.btcGasService.getGasFee(getGasDto)
      case Chain.BitcoinCash:
        return this.btcCashService.getGasFee(getGasDto)
      case Chain.Doge:
        return this.dogeGasService.getGasFee(getGasDto)
      case Chain.Litecoin:
        return this.liteCoinGasService.getGasFee(getGasDto)
      case Chain.Dash:
        return this.dashGasService.getGasFee(getGasDto)
      case Chain.Avalanche:
        return this.avaxGasService.getGasFee(getGasDto)
      case Chain.Avalanche:
        return this.bscGasService.getGasFee(getGasDto)
      case Chain.THORChain:
        return this.tcGasService.getGasFee()
      case Chain.Maya:
        return this.mayaGasService.getGasFee()
      case Chain.Binance:
        return this.bnbGasService.getGasFee()
      case Chain.Cosmos:
        return this.atomGasService.getGasFee()
      case Chain.Kuji:
        return this.kujiGasService.getGasFee()
      default:
        throw new HttpException(`${getGasDto.asset.chain} is not supported.`, HttpStatus.BAD_REQUEST)
    }
  }
}
