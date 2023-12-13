import { ApiProperty } from '@nestjs/swagger'

class Values {
  @ApiProperty({ type: Number })
  rune: number

  @ApiProperty({ type: Number })
  asset: number
}

class ValuesWithUsd {
  @ApiProperty({ type: Number })
  rune: number

  @ApiProperty({ type: Number })
  runeUsd: number

  @ApiProperty({ type: Number })
  asset: number

  @ApiProperty({ type: Number })
  assetUsd: number
}

class LpvsHodl {
  @ApiProperty({ type: Number })
  usd: number

  @ApiProperty({ type: Number })
  percent: number
}

export class PoolKpis {
  @ApiProperty({ type: String })
  address: string

  @ApiProperty({ type: String })
  pool: string

  @ApiProperty({ type: Number })
  runePrice: number

  @ApiProperty({ type: Number })
  assetPrice: number

  @ApiProperty({ type: LpvsHodl })
  lpVsHodl: {
    usd: number
    percent: number
  }

  @ApiProperty({ type: Values })
  assetShift: {
    rune: number
    asset: number
  }

  @ApiProperty({ type: ValuesWithUsd })
  added: {
    rune: number
    asset: number
    runeUsd: number
    assetUsd: number
  }

  @ApiProperty({ type: ValuesWithUsd })
  redeemable: {
    rune: number
    asset: number
    runeUsd: number
    assetUsd: number
  }
}
