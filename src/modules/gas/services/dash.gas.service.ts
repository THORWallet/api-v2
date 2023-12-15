import { Injectable } from '@nestjs/common'
import { GasFeeType, GasResponse, GetGasDto } from '../entities'
import axios from 'axios'
import { UtxoService } from './utxo.service'
import { Chain } from '../../../constants'
import { DASH_DEFAULT_SUGGESTED_TRANSACTION_FEE } from '../constans'

@Injectable()
export class DashGasService {
  constructor(private readonly utxoService: UtxoService) {}

  getSuggestedTxFee = async (): Promise<number> => {
    try {
      const response = await axios.get('https://app.bitgo.com/api/v2/dash/tx/fee')
      return response.data.feePerKb / 1000 // feePerKb to feePerByte
    } catch (error) {
      return DASH_DEFAULT_SUGGESTED_TRANSACTION_FEE
    }
  }

  async getGasFee(args: GetGasDto): Promise<GasResponse> {
    const feeRates = await this.getSuggestedTxFee()

    const rates = {
      fastest: feeRates * 1.05,
      fast: feeRates * 1.05,
      average: feeRates * 1.05,
    }
    const { memo } = args

    const fees = {
      fast: this.utxoService.calcUtxoFee(rates.fast, memo, Chain.Dash).amount().toNumber(),
      average: this.utxoService.calcUtxoFee(rates.average, memo, Chain.Dash).amount().toNumber(),
      fastest: this.utxoService.calcUtxoFee(rates.fastest, memo, Chain.Dash).amount().toNumber(),
    }

    return { gasFees: fees, rates, type: GasFeeType.DASH_FEES, baseFee: fees.average }
  }
}
