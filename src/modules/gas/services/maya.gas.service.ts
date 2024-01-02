import { Injectable } from '@nestjs/common'
import { GasFeeType, GasResponse } from '../entities'
import BigNumber from 'bignumber.js'
import { StatsService } from '../../stats/stats.service'

@Injectable()
export class MayaGasService {
  constructor(private readonly statsService: StatsService) {}

  async getGasFee(): Promise<GasResponse> {
    const mayaStats = await this.statsService.getMayaMimirStats()

    const feeNumber = new BigNumber(mayaStats.NATIVETRANSACTIONFEE).toNumber()
    return {
      gasFees: { average: feeNumber, fast: feeNumber, fastest: feeNumber },
      baseFee: feeNumber,
      type: GasFeeType.MAYA_FEES,
    }
  }
}
