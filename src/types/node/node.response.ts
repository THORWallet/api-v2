import { ApiProperty } from '@nestjs/swagger'

export type NetworkResponse = {
  bond_reward_rune: string
  burned_bep_2_rune: string
  burned_erc_20_rune: string
  effective_security_bond: string
  gas_spent_rune: string
  gas_withheld_rune: string
  native_outbound_fee_rune: string
  native_tx_fee_rune: string
  outbound_fee_multiplier: string
  rune_price_in_tor: string
  tns_fee_per_block_rune: string
  tns_register_fee_rune: string
  tor_price_in_rune: string
  total_bond_units: string
  total_reserve: string
  vaults_migrating: boolean
}

export class QuoteFees {
  @ApiProperty({ description: 'The target asset used for all fees', type: String, example: 'ETH.ETH' })
  asset: string

  @ApiProperty({ description: 'Affiliate fee in the target asset', type: String, example: '1234' })
  affiliate: string

  @ApiProperty({ description: 'Outbound fee in the target asset', type: String, example: '1234' })
  outbound: string

  @ApiProperty({ description: 'Liquidity fees paid to pools in the target asset', type: String, example: '1234' })
  liquidity: string

  @ApiProperty({ description: 'Total fees in the target asset', type: String, example: '9876' })
  total: string

  @ApiProperty({ description: 'The swap slippage in basis points', type: 'integer', example: 0 })
  slippage_bps: number

  @ApiProperty({ description: 'Total basis points in fees relative to amount out', type: 'integer', example: 0 })
  total_bps: number
}

export class NodeSwapQuoteResponse {
  @ApiProperty({ description: 'The inbound address for the transaction on the source chain', type: String })
  inbound_address: string

  @ApiProperty({
    description: 'The approximate number of source chain blocks required before processing',
    type: Number,
  })
  inbound_confirmation_blocks: number

  @ApiProperty({
    description: 'The approximate seconds for block confirmations required before processing',
    type: Number,
  })
  inbound_confirmation_seconds: number

  @ApiProperty({ description: 'The number of thorchain blocks the outbound will be delayed', type: Number })
  outbound_delay_blocks: number

  @ApiProperty({ description: 'The approximate seconds for the outbound delay before it will be sent', type: Number })
  outbound_delay_seconds: number

  @ApiProperty({ description: 'The fees for the swap', type: QuoteFees })
  fees: QuoteFees

  @ApiProperty({ description: 'Deprecated - migrate to fees object', type: Number })
  slippage_bps: number

  @ApiProperty({ description: 'Deprecated - migrate to fees object', type: Number })
  streaming_slippage_bps: number

  @ApiProperty({ description: 'The EVM chain router contract address', type: String })
  router: string

  @ApiProperty({ description: 'Expiration timestamp in unix seconds', type: Number })
  expiry: number

  @ApiProperty({ description: 'Static warning message', type: String })
  warning: string

  @ApiProperty({ description: 'Chain specific quote notes', type: String })
  notes: string

  @ApiProperty({ description: 'Defines the minimum transaction size for the chain in base units', type: String })
  dust_threshold: string

  @ApiProperty({
    description: 'The recommended minimum inbound amount for this transaction type & inbound asset',
    type: String,
  })
  recommended_min_amount_in: string

  @ApiProperty({ description: 'Generated memo for the swap', type: String })
  memo: string

  @ApiProperty({
    description: 'The amount of the target asset the user can expect to receive after fees',
    type: String,
  })
  expected_amount_out: string

  @ApiProperty({
    description: 'Deprecated - expected_amount_out is streaming amount if interval provided',
    type: String,
  })
  expected_amount_out_streaming: string

  @ApiProperty({ description: 'The maximum amount of trades a streaming swap can do for a trade', type: Number })
  max_streaming_quantity: number

  @ApiProperty({ description: 'The number of blocks the streaming swap will execute over', type: Number })
  streaming_swap_blocks: number

  @ApiProperty({ description: 'Approx the number of seconds the streaming swap will execute over', type: Number })
  streaming_swap_seconds: number

  @ApiProperty({ description: 'Total number of seconds a swap is expected to take', type: Number })
  total_swap_seconds: number
}
