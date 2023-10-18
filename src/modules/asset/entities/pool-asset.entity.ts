import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class PoolAsset {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  chain: string

  @Column()
  ticker: string

  @Column({ nullable: true })
  icon: string

  @Column({ nullable: true })
  name: string

  @Column({ nullable: true })
  decimals: number

  @Column({ nullable: true })
  contractAddress?: string

  @Column({ nullable: true })
  chainId?: number
}
