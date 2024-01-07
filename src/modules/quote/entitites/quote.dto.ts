import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'
import { NodeSwapQuoteResponse } from '../../../types/node/node.response'

export class GetSwapQuoteDto {
  @ApiProperty({ description: 'The from asset in CHAIN.TICKER format', type: String })
  @IsString()
  fromAsset: string

  @ApiProperty({ description: 'The to asset in CHAIN.TICKER format', type: String })
  @IsString()
  toAsset: string

  @ApiProperty({ description: 'The source asset amount', type: Number })
  @IsNumber()
  @Type(() => Number)
  amount: number

  @ApiProperty({ description: 'The destination address', type: String })
  @IsString()
  @IsOptional()
  destination?: string

  @ApiProperty({ description: 'The from address', type: String })
  @IsString()
  @IsOptional()
  fromAddress?: string

  @ApiProperty({
    description: 'The maximum basis points from the current feeless swap price to set the limit in the generated memo',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  toleranceBps?: number

  @ApiProperty({
    description: 'The affiliate basis points',
    type: Number,
  })
  @IsNumber()
  @Type(() => Number)
  affiliateBps: number
}

export enum RouteType {
  THORCHAIN = 'THORCHAIN',
  MAYA = 'MAYA',
}

export class CrossChainQuoteResponse {
  @ApiProperty({ description: 'Quote error', type: String, nullable: true })
  error: string | null

  @ApiProperty({ description: 'Swap quote result', type: NodeSwapQuoteResponse })
  quote: NodeSwapQuoteResponse
}

export class CrossChainQuoteCollection {
  @ApiProperty({ type: () => CrossChainQuoteResponse })
  streaming: CrossChainQuoteResponse

  @ApiProperty({ type: () => CrossChainQuoteResponse })
  base: CrossChainQuoteResponse
}

export class SwapQuoteResponse {
  @ApiProperty({ description: 'Quote from thorchain', type: CrossChainQuoteCollection })
  thorchain: CrossChainQuoteCollection

  @ApiProperty({ description: 'Quote from maya', type: CrossChainQuoteResponse })
  maya: CrossChainQuoteResponse
}
