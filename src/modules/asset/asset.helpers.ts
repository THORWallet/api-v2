import { Asset } from '@xchainjs/xchain-util'
import {
  BCH_DECIMAL,
  BNB_DECIMAL,
  BTC_DECIMAL,
  COSMOS_DECIMAL,
  Chain,
  DASH_DECIMAL,
  DOGE_DECIMAL,
  ETH_DECIMAL,
  KUJI_DECIMAL,
  LTC_DECIMAL,
  RUNE_DECIMAL,
  SupportedChains,
  erc20Decimals,
} from '../../constants'

export const AssetAVAX = { chain: Chain.Avalanche, symbol: 'AVAX', ticker: 'AVAX', synth: false }
export const AssetBSC = { chain: Chain.Bsc, symbol: 'BNB', ticker: 'BNB', synth: false }
export const AssetRuneNative = { chain: Chain.THORChain, symbol: 'RUNE', ticker: 'RUNE', synth: false }

export const assetEqualsAsset = (assetOne: Asset, assetTwo: Asset): boolean => {
  return assetEqualsPoolAsset(assetOne, assetTwo) && assetOne.synth === assetTwo.synth
}

export const assetEqualsPoolAsset = (assetOne: Asset, assetTwo: Asset): boolean => {
  return (
    assetOne.chain === assetTwo.chain &&
    assetOne.symbol.toUpperCase() === assetTwo.symbol.toUpperCase() &&
    assetOne.ticker.toUpperCase() === assetTwo.ticker.toUpperCase() &&
    (assetOne.chain !== Chain.Ethereum || assetTwo.chain !== Chain.Ethereum)
  )
}

type GetDecimals = (params: Asset, contractAddress?: string) => number

const getEthBasedDecimals = (asset: Asset, contractAddress: string): number => {
  if (asset.chain === Chain.Ethereum && asset.symbol === 'ETH' && asset.ticker === 'ETH') {
    return ETH_DECIMAL
  }

  if (assetEqualsAsset(AssetAVAX, asset)) {
    return ETH_DECIMAL
  }

  if (assetEqualsAsset(AssetBSC, asset)) {
    return ETH_DECIMAL
  }

  return erc20Decimals[contractAddress] || 0
}

const supportedGetDecimals: {
  [key in SupportedChains]: GetDecimals
} = {
  ETH: (asset, contractAddress) => getEthBasedDecimals(asset, contractAddress),
  LTC: () => LTC_DECIMAL,
  THOR: () => RUNE_DECIMAL,
  MAYA: () => RUNE_DECIMAL,
  BTC: () => BTC_DECIMAL,
  BCH: () => BCH_DECIMAL,
  BNB: () => BNB_DECIMAL,
  DOGE: () => DOGE_DECIMAL,
  GAIA: () => COSMOS_DECIMAL,
  AVAX: (asset, contractAddress) => getEthBasedDecimals(asset, contractAddress),
  BSC: (asset, contractAddress) => getEthBasedDecimals(asset, contractAddress),
  DASH: () => DASH_DECIMAL,
  KUJI: () => KUJI_DECIMAL,
}

export const getDecimalsByAsset = (asset: Asset, contractAddress?: string): Promise<number> => {
  const chain = asset.synth ? Chain.THORChain : asset.chain
  return supportedGetDecimals[chain](asset, contractAddress)
}
