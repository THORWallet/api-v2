import { Injectable } from '@nestjs/common'
import { BlockCypherFeeRateResponse, BlockchainInfoResponse } from '../entities'
import axios from 'axios'
import { ConfigService } from '@nestjs/config'

// const DEFAULT_SUGGESTED_TRANSACTION_FEE = 127

@Injectable()
export class BitcoinGasService {
  constructor(private configService: ConfigService) {}

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

  // async getGasFee(args: GetGasDto): Promise<any> {}
}
