export enum Chain {
  Avalanche = 'AVAX',
  Binance = 'BNB',
  Bitcoin = 'BTC',
  Ethereum = 'ETH',
  THORChain = 'THOR',
  Cosmos = 'GAIA',
  BitcoinCash = 'BCH',
  Litecoin = 'LTC',
  Terra = 'TERRA',
  Doge = 'DOGE',
  Bsc = 'BSC',
  Dash = 'DASH',
  Kuji = 'KUJI',
  Maya = 'MAYA',
}

export const supportedChains: Chain[] = [
  Chain.Avalanche,
  Chain.Ethereum,
  Chain.THORChain,
  Chain.Bitcoin,
  Chain.BitcoinCash,
  Chain.Litecoin,
  Chain.Binance,
  Chain.Doge,
  Chain.Terra,
  Chain.Cosmos,
  Chain.Maya,
  Chain.Dash,
  Chain.Kuji,
  Chain.Bsc,
]

export type SupportedChains =
  | Chain.Ethereum
  | Chain.THORChain
  | Chain.Bitcoin
  | Chain.BitcoinCash
  | Chain.Litecoin
  | Chain.Binance
  | Chain.Doge
  | Chain.Cosmos
  | Chain.Avalanche
  | Chain.Kuji
  | Chain.Bsc
  | Chain.Maya
  | Chain.Dash

export const chainNameMapping: Record<Chain, string> = {
  AVAX: 'Avalanche',
  BNB: 'Binance',
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  THOR: 'THORChain',
  GAIA: 'Cosmos',
  BCH: 'BitcoinCash',
  LTC: 'Litecoin',
  TERRA: 'Terra',
  DOGE: 'Doge',
  BSC: 'Bsc',
  DASH: 'Dash',
  KUJI: 'Kujira',
  MAYA: 'Maya',
}
