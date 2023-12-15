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

export type UTXOChain = Chain.Bitcoin | Chain.BitcoinCash | Chain.Doge | Chain.Litecoin | Chain.Dash

export const chainIds = {
  Ethereum: 1 as const,
  EthereumRopsten: 3 as const,
  BinanceSmartChain: 56 as const,
  Polygon: 137 as const,
  Avalanche: 43114 as const,
  Moonbeam: 1284 as const,
  Moonriver: 1285 as const,
  Fantom: 250 as const,
  ArbitrumOne: 42161 as const,
  Canto: 7700 as const,
  zkSync: 324 as const,
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

export const nativeChainAssetIcons: Record<Chain, string> = {
  AVAX: '',
  BNB: '',
  BTC: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
  ETH: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
  THOR: 'https://assets.coingecko.com/coins/images/6595/large/RUNE.png?1614160507',
  GAIA: '',
  BCH: 'https://assets.coingecko.com/coins/images/780/large/bitcoin-cash-circle.png?1594689492',
  LTC: 'https://assets.coingecko.com/coins/images/2/large/litecoin.png?1547033580',
  TERRA: '',
  DOGE: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png?1547792256',
  BSC: '',
  DASH: '',
  KUJI: '',
  MAYA: '',
}

export const runeDenom = 'rune'
export const mayaDenom = 'maya'
export const cacaoDenom = 'cacao'
export const kujiDenom = 'ukuji'
