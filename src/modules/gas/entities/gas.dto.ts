import { ApiProperty } from '@nestjs/swagger'
import { Asset } from '../../asset/entities/pool-asset.entity'
import { IsDefined, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { EthGasResponse } from './eth.types'

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

export class GasResponse extends EthGasResponse {}
