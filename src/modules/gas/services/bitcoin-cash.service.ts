import { Injectable } from '@nestjs/common'
import { GasFeeType, GasResponse, GetGasDto } from '../entities'
import axios from 'axios'
import { UtxoService } from './utxo.service'
import { Chain } from '../../../constants'
import { BTC_CASH_DEFAULT_SUGGESTED_TRANSACTION_FEE } from '../constans'

@Injectable()
export class BitcoinCashGasService {
  constructor(private readonly utxoService: UtxoService) {}

  getSuggestedTxFee = async (): Promise<number> => {
    //So use Bitgo API for fee estimation
    //Refer: https://app.bitgo.com/docs/#operation/v2.tx.getfeeestimate
    try {
      const response = await axios.get('https://app.bitgo.com/api/v2/bch/tx/fee')
      return response.data.feePerKb / 1000 // feePerKb to feePerByte
    } catch (error) {
      return BTC_CASH_DEFAULT_SUGGESTED_TRANSACTION_FEE
    }
  }

  async getGasFee(args: GetGasDto): Promise<GasResponse> {
    const feeRate = await this.getSuggestedTxFee()

    const rates = {
      fastest: feeRate * 5,
      fast: feeRate * 2,
      average: feeRate * 1,
    }
    const { memo } = args

    const fees = {
      fast: this.utxoService.calcUtxoFee(rates.fast, memo, Chain.BitcoinCash).amount().toNumber(),
      average: this.utxoService.calcUtxoFee(rates.average, memo, Chain.BitcoinCash).amount().toNumber(),
      fastest: this.utxoService.calcUtxoFee(rates.fastest, memo, Chain.BitcoinCash).amount().toNumber(),
    }

    return { gasFees: fees, rates, type: GasFeeType.BTCH_FEES, baseFee: fees.average }
  }
}
