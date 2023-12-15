export type BlockCypherFeeRateResponse = {
  name: string
  height: number
  hash: string
  time: string
  latest_url: string
  previous_hash: string
  previous_url: string
  peer_count: number
  unconfirmed_count: number
  high_fee_per_kb: number
  medium_fee_per_kb: number
  low_fee_per_kb: number
  last_fork_height: number
  last_fork_hash: string
}
type Limits = {
  min: number
  max: number
}

export type BlockchainInfoResponse = {
  limits: Limits
  regular: number
  priority: number
}
