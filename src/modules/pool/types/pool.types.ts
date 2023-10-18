import { ApiProperty } from '@nestjs/swagger'

export class PoolDetail {
  @ApiProperty({ type: String })
  annualPercentageRate: string

  @ApiProperty({ type: String })
  asset: string

  @ApiProperty({ type: String })
  assetDepth: string

  @ApiProperty({ type: String })
  assetPrice: string

  @ApiProperty({ type: String })
  assetPriceUSD: string

  @ApiProperty({ type: String })
  liquidityUnits: string

  @ApiProperty({ type: String })
  poolAPY: string

  @ApiProperty({ type: String })
  runeDepth: string

  @ApiProperty({ type: String })
  status: string

  @ApiProperty({ type: String })
  synthSupply: string

  @ApiProperty({ type: String })
  synthUnits: string

  @ApiProperty({ type: String })
  units: string

  @ApiProperty({ type: String })
  volume24h: string

  @ApiProperty({ type: String })
  saversDepth: string

  @ApiProperty({ type: String })
  saversUnits: string

  @ApiProperty({ type: String })
  saversAPR: string
}
