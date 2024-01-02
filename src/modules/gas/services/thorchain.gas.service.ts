import { Injectable } from '@nestjs/common'
import { GasFeeType, GasResponse } from '../entities'
import { ConfigService } from '@nestjs/config'
import { NetworkResponse } from '../../../types/node/node.response'
import axios from 'axios'
import BigNumber from 'bignumber.js'

@Injectable()
export class ThorchainGasService {
  constructor(private configService: ConfigService) {}

  async getGasFee(): Promise<GasResponse> {
    const nodeUrl = this.configService.get('THORNODE_URL')

    const {
      data: { native_tx_fee_rune: fee },
    } = await axios.get<NetworkResponse>(`${nodeUrl}/thorchain/network`)

    const feeNumber = new BigNumber(fee).toNumber()
    return {
      gasFees: { average: feeNumber, fast: feeNumber, fastest: feeNumber },
      baseFee: feeNumber,
      type: GasFeeType.TC_FEES,
    }
  }
}
