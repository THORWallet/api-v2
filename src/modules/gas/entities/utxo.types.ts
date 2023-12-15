export type Witness = {
  value: number
  script: Buffer
}
export type UTXO = {
  hash: string
  index: number
  value: number
  witnessUtxo: Witness | null
  txHex: string
}

export type UTXOs = UTXO[]

export type BroadcastTxParams = {
  network: string
  txHex: string
  blockstreamUrl: string
}

// We might extract it into xchain-client later
export type DerivePath = { mainnet: string; testnet: string }
