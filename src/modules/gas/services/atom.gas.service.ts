import { Injectable } from '@nestjs/common'
import { GasFeeType, GasResponse } from '../entities'

@Injectable()
export class AtomGasService {
  constructor() {}

  async getGasFee(): Promise<GasResponse> {
    return {
      gasFees: { average: 2000, fast: 2500, fastest: 3200 },
      baseFee: 2000,
      type: GasFeeType.GAIA_FEES,
    }
  }
}
