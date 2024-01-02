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

export class Stats {
  @ApiProperty({ type: StatsData })
  thorchain: StatsData
  @ApiProperty({ type: StatsData })
  maya: StatsData
}

export type MimirStats = {
  BADVALIDATORREDLINE: number
  BURNSYNTHS: number
  CHURNINTERVAL: number
  DESIREDVALIDATORSET: number
  EMISSIONCURVE: number
  FULLIMPLOSSPROTECTIONBLOCKS: number
  FUNDMIGRATIONINTERVAL: number
  HALTBCHCHAIN: number
  HALTTHORTRADING: number
  HALTBCHTRADING: number
  HALTBNBCHAIN: number
  HALTBNBTRADING: number
  HALTBTCCHAIN: number
  HALTBTCTRADING: number
  HALTCHAINGLOBAL: number
  HALTCHURNING: number
  HALTDOGECHAIN: number
  HALTDOGETRADING: number
  HALTETHCHAIN: number
  HALTAVAXCHAIN: number
  HALTETHTRADING: number
  HALTAVAXTRADING: number
  HALTLTCCHAIN: number
  HALTLTCTRADING: number
  HALTTERRACHAIN: number
  HALTTERRATRADING: number
  HALTGAIACHAIN: number
  HALTBSCCHAIN: number
  HALTBSCTRADING: number
  HALTGAIATRADING: number
  HALTTHORCHAIN: number
  HALTTRADING: number
  MAXIMUMLIQUIDITYRUNE: number
  MAXLIQUIDITYRUNE: number
  MAXSYNTHPERASSETDEPTH: number
  MAXSYNTHPERPOOLDEPTH: number
  MAXUTXOSTOSPEND: number
  MINIMUMBONDINRUNE: number
  MINRUNEPOOLDEPTH: number
  MINTSYNTHS: number
  NODEOPERATORFEE: number
  NUMBEROFNEWNODESPERCHURN: number
  OBSERVATIONDELAYFLEXIBILITY: number
  PAUSELP: number
  PAUSELPBCH: number
  PAUSELPBNB: number
  PAUSELPBTC: number
  PAUSELPDOGE: number
  PAUSELPETH: number
  PAUSELPAVAX: number
  PAUSELPBSC: number
  PAUSELPLTC: number
  PAUSELPTERRA: number
  PAUSELPGAIA: number
  POOLCYCLE: number
  POOLDEPTHFORYGGFUNDINGMIN: number
  STOPFUNDYGGDRASIL: number
  STOPSOLVENCYCHECK: number
  STOPSOLVENCYCHECKBNB: number
  STOPSOLVENCYCHECKETH: number
  THORNAME: number
  THORNAMES: number
  VALIDATORMAXREWARDRATIO: number
  YGGFUNDRETRY: number
  LIQUIDITYAUCTION?: number
  NATIVETRANSACTIONFEE?: number
  STREAMINGSWAPMINBPFEE: number
  HALTSIGNINGKUJI: number
  HALTKUJITRADING: number
  HALTDASHCHAIN: number
  HALTSIGNINGDASH: number
  PAUSELPDASH: number
  HALTDASHTRADING: number
}
