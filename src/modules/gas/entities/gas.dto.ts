import { ApiProperty } from '@nestjs/swagger'
import { Asset } from '../../asset/entities/pool-asset.entity'
import { IsDefined, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export enum TransactionType {
  DEPOSIT = 'deposit',
  TRANSFER = 'transfer',
}

export class GetGasDto {
  @ApiProperty({ description: 'The sender address', type: String })
  @IsString()
  senderAddress: string

  @ApiProperty({ description: 'The recipient address', type: String })
  @IsString()
  recipientAddress: string

  @ApiProperty({ description: `The amount in assetAmount, without the asset's decimal adjustment`, type: String })
  @IsString()
  amount: string

  @ApiProperty({ description: 'The asset', type: Asset })
  @ValidateNested()
  @IsDefined()
  @Type(() => Asset)
  asset: Asset

  @ApiProperty({ description: 'The memo', type: String, required: false })
  @IsString()
  @IsOptional()
  memo?: string

  @ApiProperty({ description: 'The type', enum: TransactionType, required: false })
  @IsEnum(TransactionType)
  @IsOptional()
  txType?: TransactionType
}

export class GasFees {
  @ApiProperty({ description: 'The average gas fee', type: Number })
  average: number
  @ApiProperty({ description: 'The fast gas fee', type: Number })
  fast: number
  @ApiProperty({ description: 'The fastest gas fee', type: Number })
  fastest: number
}

export enum GasFeeType {
  ETH_FEES = 'eth-fees',
  BTC_FEES = 'btc-fees',
  DOGE_FEES = 'doge-fees',
  LTC_FEES = 'ltc-fees',
  BTCH_FEES = 'btch-fees',
  DASH_FEES = 'dash-fees',
  AVAX_FEES = 'avax-fees',
  BSC_FEES = 'bsc-fees',
  TC_FEES = 'tc-fees',
  MAYA_FEES = 'maya-fees',
}

export class GasResponse {
  @ApiProperty({ description: 'The gas fee dominated in asset', type: GasFees })
  gasFees: GasFees
  @ApiProperty({ description: 'The different gas rates for utxo-s / byte', type: GasFees, required: false })
  rates?: GasFees
  @ApiProperty({ description: 'The base fee', type: Number })
  baseFee: number
  @ApiProperty({ description: 'Chain id for the gasFee', type: Number, required: false })
  chainId?: number
  @ApiProperty({ description: 'Gas fee type', enum: TransactionType, required: false })
  type: GasFeeType
}
