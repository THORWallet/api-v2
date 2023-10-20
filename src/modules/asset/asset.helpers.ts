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
export const AssetAtom: Asset = {
  chain: Chain.Cosmos,
  symbol: 'ATOM',
  ticker: 'ATOM',
  synth: false,
}

export const getCosmosAssetFromDenom = (denom: string): Asset | null => {
  if (denom === 'uatom') return AssetAtom
  // IBC assets
  if (denom.startsWith('ibc/'))
    // Note: Don't use `assetFromString` here, it will interpret `/` as synth
    return {
      chain: Chain.Cosmos,
      symbol: denom,
      // TODO (xchain-contributors)
      // Get readable ticker for IBC assets from denom #600 https://github.com/xchainjs/xchainjs-lib/issues/600
      // At the meantime ticker will be empty
      ticker: '',
      synth: false,
    }
  return null
}

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

export const getDecimalsByAsset = (asset: Asset, contractAddress?: string): number => {
  const chain = asset.synth ? Chain.THORChain : asset.chain
  return supportedGetDecimals[chain](asset, contractAddress)
}
