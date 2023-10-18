import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

@Entity()
export class PoolAsset {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'The unique identifier for the asset', type: Number })
  id: number

  @Column()
  @ApiProperty({ description: 'The blockchain the asset belongs to', type: String })
  chain: string

  @Column()
  @ApiProperty({ description: 'The ticker symbol for the asset', type: String })
  ticker: string

  @Column({ nullable: true })
  @ApiProperty({ description: 'URL for the asset icon', type: String, required: false })
  icon: string

  @Column({ nullable: true })
  @ApiProperty({ description: 'The name of the asset', type: String, required: false })
  name: string

  @Column({ nullable: true })
  @ApiProperty({ description: 'The number of decimals for the asset', type: Number, required: false })
  decimals: number

  @Column({ nullable: true })
  @ApiProperty({ description: 'The contract address of the asset', type: String, required: false })
  contractAddress?: string

  @Column({ nullable: true })
  @ApiProperty({ description: 'The chain ID associated with the asset', type: Number, required: false })
  chainId?: number
}
