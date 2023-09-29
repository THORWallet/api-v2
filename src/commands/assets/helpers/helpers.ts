export const SupportedChainIds = {
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

export const ecosystems = [
  {
    category: 'avalanche-ecosystem',
    platform: 'avalanche',
    chainId: SupportedChainIds.Avalanche,
  },
  {
    category: 'moonbeam-ecosystem',
    platform: 'moonbeam',
    chainId: SupportedChainIds.Moonbeam,
  },
  {
    category: 'moonriver-ecosystem',
    platform: 'moonriver',
    chainId: SupportedChainIds.Moonriver,
  },
  {
    category: 'arbitrum-ecosystem',
    platform: 'arbitrum-one',
    chainId: SupportedChainIds.ArbitrumOne,
  },
  {
    category: 'polygon-ecosystem',
    platform: 'polygon-pos',
    chainId: SupportedChainIds.Polygon,
  },
  {
    category: 'fantom-ecosystem',
    platform: 'fantom',
    chainId: SupportedChainIds.Fantom,
  },
  {
    category: 'binance-smart-chain',
    platform: 'binance-smart-chain',
    chainId: SupportedChainIds.BinanceSmartChain,
  },
]
