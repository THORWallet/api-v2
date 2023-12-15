import { Injectable } from '@nestjs/common'
import { GasFeeType, GasResponse, GetGasDto } from '../entities'
import { ConfigService } from '@nestjs/config'
import { UtxoService } from './utxo.service'
import { Chain } from '../../../constants'

@Injectable()
export class DogeGasService {
  constructor(
    private configService: ConfigService,
    private readonly utxoService: UtxoService,
  ) {}

  getSuggestedTxFee = (): {
    fastest: number
    fast: number
    average: number
  } => {
    return {
      fastest: (1 * 10 ** 8) / 1000,
      fast: (0.011 * 10 ** 8) / 1000,
      average: (0.01 * 10 ** 8) / 1000,
    }
  }

  getGasFee(args: GetGasDto): GasResponse {
    const feeRates = this.getSuggestedTxFee()

    const rates = {
      fastest: feeRates.fastest * 1.05,
      fast: feeRates.fast * 1.05,
      average: feeRates.average * 1.05,
    }
    const { memo } = args

    const fees = {
      fast: this.utxoService.calcUtxoFee(rates.fast, memo, Chain.Doge).amount().toNumber(),
      average: this.utxoService.calcUtxoFee(rates.average, memo, Chain.Doge).amount().toNumber(),
      fastest: this.utxoService.calcUtxoFee(rates.fastest, memo, Chain.Doge).amount().toNumber(),
    }

    return { gasFees: fees, rates, type: GasFeeType.DOGE_FEES, baseFee: fees.average }
  }
}
