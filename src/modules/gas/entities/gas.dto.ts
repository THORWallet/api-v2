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
  @ApiProperty({ description: 'The average gas fee', type: String })
  average: string
  @ApiProperty({ description: 'The fast gas fee', type: String })
  fast: string
  @ApiProperty({ description: 'The fastest gas fee', type: String })
  fastest: string
}

export enum GasFeeType {
  ETH_FEES = 'eth-fees',
}

export class GasResponse {
  @ApiProperty({ description: 'The gas fee', type: GasFees })
  gasFees: GasFees
  @ApiProperty({ description: 'The base fee', type: String })
  baseFee: string
  @ApiProperty({ description: 'Chain id for the gasFee', type: Number, required: false })
  chainId?: number
  @ApiProperty({ description: 'Gas fee type', enum: TransactionType, required: false })
  type: GasFeeType
}
