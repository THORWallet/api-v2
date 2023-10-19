import { ApiProperty } from '@nestjs/swagger'

export class BalanceAsset {
  @ApiProperty({ description: 'The blockchain the asset belongs to', type: String })
  chain: string

  @ApiProperty({ description: 'The ticker symbol for the asset', type: String })
  ticker: string

  @ApiProperty({ description: 'URL for the asset icon', type: String, required: false })
  icon: string

  @ApiProperty({ description: 'The name of the asset', type: String, required: false })
  name: string

  @ApiProperty({ description: 'The number of decimals for the asset', type: Number, required: false })
  decimals: number

  @ApiProperty({ description: 'The contract address of the asset', type: String, required: false })
  contractAddress?: string

  @ApiProperty({ description: 'The chain ID associated with the asset', type: Number, required: false })
  chainId?: number

  @ApiProperty({ description: 'The USD price of the asset', type: String, required: false })
  usdPrice?: string
}

export class Balance {
  @ApiProperty({ description: 'The asset associated with the balance' })
  asset: BalanceAsset

  @ApiProperty({ description: 'The amount of the asset with decimals', type: String })
  amount: string

  @ApiProperty({ description: 'The amount of the asset', type: String })
  rawAmount: string
}
