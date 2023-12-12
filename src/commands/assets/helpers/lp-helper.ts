import BigNumber from 'bignumber.js'
import { RUNE_DECIMAL } from '../../../constants'
import { MidgardAction } from '../types/midgard-actions'

export const marshallMemberInfo = (pool: string, res: any): { assetAddress: string; runeAddress: string } | null => {
  if (!res || !res.pools) return null

  const memberPool = res.pools.find((p: any) => p.pool === pool)
  if (!memberPool) return null

  return {
    // assetAdded: 552162601,
    assetAddress: memberPool.assetAddress,
    // assetDeposit: 552162601,
    // assetPending: 0,
    // assetWithdrawn: 0,
    // dateFirstAdded: 1701262107,
    // dateLastAdded: 1701871509,
    // liquidityUnits: 1655146740,
    // pool: memberPool.pool,
    // runeAdded: 1922505261,
    runeAddress: memberPool.runeAddress,
    // runeDeposit: 1922505261,
    // runePending: 0,
    // runeWithdrawn: 0
  }
}

export const marshallLastBlock = (res: any): number | null => {
  if (!res || !res[0]) return null
  return res[0].thorchain
}

export const marshallPoolInfo = (res: any): { balanceRune: BigNumber; balanceAsset: BigNumber } | null => {
  if (!res) return null
  return {
    balanceRune: new BigNumber(res.balance_rune || 0).div(10 ** RUNE_DECIMAL),
    balanceAsset: new BigNumber(res.balance_asset || 0).div(10 ** RUNE_DECIMAL),
  }
}

export const marshallRunePrice = (res: any): BigNumber | null => {
  if (!res) return null
  return new BigNumber(res.balance_asset).div(res.balance_rune)
}

export const marshallLp = (
  res: any,
): {
  assetDepositValue: BigNumber
  runeDepositValue: BigNumber
  assetRedeemValue: BigNumber
  runeRedeemValue: BigNumber
} | null => {
  if (!res) return null
  return {
    assetDepositValue: new BigNumber(res.asset_deposit_value || 0).div(10 ** RUNE_DECIMAL),
    runeDepositValue: new BigNumber(res.rune_deposit_value || 0).div(10 ** RUNE_DECIMAL),
    assetRedeemValue: new BigNumber(res.asset_redeem_value || 0).div(10 ** RUNE_DECIMAL),
    runeRedeemValue: new BigNumber(res.rune_redeem_value || 0).div(10 ** RUNE_DECIMAL),
  }
}

export const marshallMidgardActions = (res: any): MidgardAction[] | null => {
  if (!res || !res.actions) return null
  return res.actions
}

export const marshallHistoryDepthsPriceInUsd = (res: any): { assetPriceUsd: number; runePriceUsd: number } | null => {
  if (!res || !res.intervals || res.intervals.length < 1) return null
  return {
    runePriceUsd: Number(res.intervals[0].assetPriceUSD) / Number(res.intervals[0].assetPrice),
    assetPriceUsd: Number(res.intervals[0].assetPriceUSD),
  }
}
