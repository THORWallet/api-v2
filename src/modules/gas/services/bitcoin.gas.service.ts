import { Injectable } from '@nestjs/common'
import { BlockCypherFeeRateResponse, BlockchainInfoResponse, GasFeeType, GasResponse, GetGasDto } from '../entities'
import axios from 'axios'
import { ConfigService } from '@nestjs/config'
import { UtxoService } from './utxo.service'
import { Chain } from '../../../constants'

@Injectable()
export class BitcoinGasService {
  constructor(
    private configService: ConfigService,
    private readonly utxoService: UtxoService,
  ) {}

  getSuggestedTxFee = async (): Promise<{
    high: number
    medium: number
    low: number
  }> => {
    try {
      const response = await axios.get<BlockCypherFeeRateResponse>(
        this.configService.get('BLOCKCYPHER_URL') + 'btc/main',
        {
          params: {
            token: this.configService.get('BLOCKCYPHER_TOKEN'),
          },
        },
      )

      return {
        high: response.data.high_fee_per_kb / 1000,
        medium: response.data.medium_fee_per_kb / 1000,
        low: response.data.low_fee_per_kb / 1000,
      }
    } catch (error) {
      const response = await axios.get<BlockchainInfoResponse>('https://api.blockchain.info/mempool/fees')
      return {
        high: response.data.priority,
        medium: response.data.regular,
        low: response.data.regular,
      }
    }
  }

  async getGasFee(args: GetGasDto): Promise<GasResponse> {
    const feeRates = await this.getSuggestedTxFee()

    const rates = {
      fastest: feeRates.high * 1.05,
      fast: feeRates.medium * 1.05,
      average: feeRates.low * 1.05,
    }
    const { memo } = args

    const fees = {
      fast: this.utxoService.calcUtxoFee(rates.fast, memo, Chain.Bitcoin).amount().toNumber(),
      average: this.utxoService.calcUtxoFee(rates.average, memo, Chain.Bitcoin).amount().toNumber(),
      fastest: this.utxoService.calcUtxoFee(rates.fastest, memo, Chain.Bitcoin).amount().toNumber(),
    }

    return { gasFees: fees, rates, type: GasFeeType.BTC_FEES, baseFee: fees.average }
  }
}
