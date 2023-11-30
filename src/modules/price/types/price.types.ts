import { ApiProperty } from '@nestjs/swagger'

export class PriceHistoryResponse {
  @ApiProperty({ description: 'The asset ID', type: String })
  id: string
  @ApiProperty({ description: 'The asset name', type: String })
  name: string
  @ApiProperty({ description: `The asset's price change in $ 24h`, type: Number })
  priceChange24hUsd: number
  @ApiProperty({ description: `The asset's price change in % 24h`, type: String })
  priceChange24hPercentage: string
  @ApiProperty({ description: 'The asset symbol', type: [[Number]], example: [[1700784000000, 37293.316127426726]] })
  history: number[]
  @ApiProperty({ description: 'The asset price at cache time', type: Number })
  currentPriceInUsd: number
  @ApiProperty({ description: 'Current time fro price', type: Number })
  timeStamp: number
}
