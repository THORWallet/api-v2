import { Injectable } from '@nestjs/common'
import { GasFeeType, GasResponse } from '../entities'

@Injectable()
export class KujiGasService {
  constructor() {}

  async getGasFee(): Promise<GasResponse> {
    const fee = 100000

    return {
      gasFees: { average: fee, fast: fee, fastest: fee },
      baseFee: fee,
      type: GasFeeType.KUJI_FEES,
    }
  }
}
