import { Injectable } from '@nestjs/common'
import { GasFeeType, GasResponse, GetGasDto } from '../entities'
import axios from 'axios'

import { UtxoService } from './utxo.service'
import { Chain } from '../../../constants'
import { LTC_DEFAULT_SUGGESTED_TRANSACTION_FEE } from '../constans'

@Injectable()
export class LitecoinGasService {
  constructor(private readonly utxoService: UtxoService) {}

  getSuggestedTxFee = async (): Promise<number> => {
    try {
      const response = await axios.get('https://app.bitgo.com/api/v2/ltc/tx/fee')
      return response.data.feePerKb / 1000 // feePerKb to feePerByte
    } catch (error) {
      return LTC_DEFAULT_SUGGESTED_TRANSACTION_FEE
    }
  }

  async getGasFee(args: GetGasDto): Promise<GasResponse> {
    const feeRate = await this.getSuggestedTxFee()

    const rates = {
      fastest: feeRate * 5,
      fast: feeRate * 1,
      average: feeRate * 0.5,
    }
    const { memo } = args

    const fees = {
      fast: this.utxoService.calcUtxoFee(rates.fast, memo, Chain.Litecoin).amount().toNumber(),
      average: this.utxoService.calcUtxoFee(rates.average, memo, Chain.Litecoin).amount().toNumber(),
      fastest: this.utxoService.calcUtxoFee(rates.fastest, memo, Chain.Litecoin).amount().toNumber(),
    }

    return { gasFees: fees, rates, type: GasFeeType.LTC_FEES, baseFee: fees.average }
  }
}
