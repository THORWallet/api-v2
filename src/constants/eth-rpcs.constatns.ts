import { SupportedChainIds } from '../commands/assets/helpers/helpers'
import { EvmChainId } from '../types/chains/chains.type'

export const ethRpcs: {
  [key in EvmChainId]: { rpcUrl: string; networkName: string }
} = {
  [SupportedChainIds.Ethereum]: {
    rpcUrl: 'https://mainnet.infura.io',
    networkName: 'Ethereum',
  },
  [SupportedChainIds.EthereumRopsten]: {
    rpcUrl: 'https://ropsten.infura.io',
    networkName: 'Ropsten Test Network',
  },
  [SupportedChainIds.Moonbeam]: {
    rpcUrl: 'https://rpc.api.moonbeam.network',
    networkName: 'Moonbeam',
  },
  [SupportedChainIds.Moonriver]: {
    rpcUrl: 'https://rpc.api.moonriver.moonbeam.network',
    networkName: 'Moonriver',
  },
  [SupportedChainIds.Polygon]: {
    rpcUrl: 'https://polygon-rpc.com/',
    networkName: 'Polygon Matic',
  },
  [SupportedChainIds.Avalanche]: {
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    networkName: 'Avalanche',
  },
  [SupportedChainIds.ArbitrumOne]: {
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    networkName: 'Arbitrum One',
  },
  [SupportedChainIds.Fantom]: {
    rpcUrl: 'https://rpc.ftm.tools/',
    networkName: 'Fantom Opera',
  },
  [SupportedChainIds.BinanceSmartChain]: {
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    networkName: 'BNB Smart Chain',
  },
  [SupportedChainIds.Canto]: {
    rpcUrl: 'https://canto.slingshot.finance/',
    networkName: 'Canto',
  },
  [SupportedChainIds.zkSync]: {
    rpcUrl: 'https://mainnet.era.zksync.io',
    networkName: 'zkSync',
  },
}
