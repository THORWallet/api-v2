import { ApiProperty } from '@nestjs/swagger'
import { Asset } from '@xchainjs/xchain-util'

export class Balance {
  @ApiProperty({ description: 'The asset associated with the balance' })
  asset: Asset

  @ApiProperty({ description: 'The amount of the asset with decimals', type: String })
  amount: string

  @ApiProperty({ description: 'The amount of the asset', type: String })
  rawAmount: string

  @ApiProperty({ description: 'Decimals for the asset', type: Number })
  decimals: number
}
