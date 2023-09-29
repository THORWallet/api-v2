import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Asset {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  chain: string

  @Column()
  ticker: string

  @Column()
  icon: string

  @Column()
  name: string

  @Column({ nullable: true })
  decimals: number

  @Column({ nullable: true })
  contractAddress?: string

  @Column({ nullable: true })
  chainId?: number
}
