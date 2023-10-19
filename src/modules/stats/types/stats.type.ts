import { ApiProperty } from '@nestjs/swagger'

export class StatsData {
  @ApiProperty({
    example: '1000',
  })
  addLiquidityCount: string

  @ApiProperty({
    example: '100000000',
  })
  addLiquidityVolume: string

  @ApiProperty({
    example: '500',
  })
  dailyActiveUsers: string

  @ApiProperty({
    example: '50000000',
  })
  impermanentLossProtectionPaid: string

  @ApiProperty({
    example: '2000',
  })
  monthlyActiveUsers: string

  @ApiProperty({
    example: '100000000',
  })
  runeDepth: string

  @ApiProperty({
    example: '1.5',
  })
  runePriceUSD: string

  @ApiProperty({
    example: '5000',
  })
  swapCount: string

  @ApiProperty({
    example: '1000000',
  })
  swapCount24h: string

  @ApiProperty({
    example: '50000',
  })
  swapCount30d: string

  @ApiProperty({
    example: '100000000',
  })
  swapVolume: string

  @ApiProperty({
    example: '50000000',
  })
  switchedRune: string

  @ApiProperty({
    example: '2000',
  })
  toAssetCount: string

  @ApiProperty({
    example: '3000',
  })
  toRuneCount: string

  @ApiProperty({
    example: '10000',
  })
  uniqueSwapperCount: string

  @ApiProperty({
    example: '100',
  })
  withdrawCount: string

  @ApiProperty({
    example: '50000000',
  })
  withdrawVolume: string
}
