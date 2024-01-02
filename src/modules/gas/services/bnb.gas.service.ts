import { Injectable } from '@nestjs/common'
import { GasFeeType, GasResponse } from '../entities'
import BigNumber from 'bignumber.js'

import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import { BinanceFees } from '../../../types/bnb/bnb-client.types'
import { isTransferFee } from '../../../utils/bnb.utils'

@Injectable()
export class BnbGasService {
  constructor(private readonly configService: ConfigService) {}

  async getGasFee(): Promise<GasResponse> {
    const { data: feesArray } = await axios.get<BinanceFees>(`${this.configService.get('BNB_CLIENT_URL')}/api/v1/fees`)

    const [transferFee] = feesArray.filter(isTransferFee)

    const singleTxFee = transferFee.fixed_fee_params.fee

    const feeNumber = new BigNumber(singleTxFee).toNumber()
    return {
      gasFees: { average: feeNumber, fast: feeNumber, fastest: feeNumber },
      baseFee: feeNumber,
      type: GasFeeType.BNB_FEES,
    }
  }
}
