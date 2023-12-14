import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { DepthAndPriceHistory, PoolDetail, TvlResponse } from './types/pool.types'
import { POOL_KEYS } from './cache-keys/pool.cache-keys'
import { CACHE_TIME, RUNE_DECIMAL } from '../../constants'
import axios from 'axios'
import { ConfigService } from '@nestjs/config'
import {
  marshallHistoryDepthsPriceInUsd,
  marshallLp,
  marshallMemberInfo,
  marshallMidgardActions,
  marshallPoolInfo,
  marshallRunePrice,
} from 'modules/pool/helpers/lp-helper'
import { PoolKpis } from './types/pool-kpis.types'
import { MidgardAction } from 'types/midgard/midgard-actions'
import BigNumber from 'bignumber.js'

@Injectable()
export class PoolService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  getThorchainMidgardPools = async (): Promise<PoolDetail[]> => {
    const tcMidgardPool = await this.cacheManager.get<PoolDetail[]>(POOL_KEYS.tcMidgardPool)
    if (tcMidgardPool) {
      return tcMidgardPool
    }

    const { data } = await axios.get<PoolDetail[]>(this.configService.get('PUBLIC_TC_MIDGARD_URL') + '/pools')
    await this.cacheManager.set(POOL_KEYS.tcMidgardPool, data, CACHE_TIME.minute * 5)
    return data
  }

  getMayaMidgardPools = async (): Promise<PoolDetail[]> => {
    const mayaMidgardPool = await this.cacheManager.get<PoolDetail[]>(POOL_KEYS.mayaMidgardPool)
    if (mayaMidgardPool) {
      return mayaMidgardPool
    }

    const { data } = await axios.get<PoolDetail[]>(this.configService.get('MAYA_MIDGARD_URL') + '/pools')
    await this.cacheManager.set(POOL_KEYS.mayaMidgardPool, data, CACHE_TIME.minute * 5)
    return data
  }

  getTcPoolDepthHistory = async ({ pool, count }: { pool: string; count: number }): Promise<DepthAndPriceHistory> => {
    const tcPoolHistory = await this.cacheManager.get<DepthAndPriceHistory>(POOL_KEYS.tcPoolHistory(pool, count))
    if (tcPoolHistory) {
      return tcPoolHistory
    }

    const { data } = await axios.get<DepthAndPriceHistory>(
      this.configService.get('PUBLIC_TC_MIDGARD_URL') + `/history/depths/${pool}`,
      { params: { interval: 'day', count } },
    )

    await this.cacheManager.set(POOL_KEYS.tcPoolHistory(pool, count), data, CACHE_TIME.minute * 5)
    return data
  }

  getMayaPoolDepthHistory = async ({ pool, count }: { pool: string; count: number }): Promise<DepthAndPriceHistory> => {
    const mayaPoolHistory = await this.cacheManager.get<DepthAndPriceHistory>(POOL_KEYS.mayaPoolHistory(pool, count))
    if (mayaPoolHistory) {
      return mayaPoolHistory
    }

    const { data } = await axios.get<DepthAndPriceHistory>(
      this.configService.get('MAYA_MIDGARD_URL') + `/history/depths/${pool}`,
      { params: { interval: 'day', count } },
    )

    await this.cacheManager.set(POOL_KEYS.mayaPoolHistory(pool, count), data, CACHE_TIME.minute * 5)
    return data
  }

  getTcTvlHistory = async ({ count }: { count: number }): Promise<TvlResponse> => {
    const { data } = await axios.get<TvlResponse>(this.configService.get('PUBLIC_TC_MIDGARD_URL') + '/history/tvl', {
      params: { interval: 'day', count },
    })

    return data
  }

  getMayaTvlHistory = async ({ count }: { count: number }): Promise<TvlResponse> => {
    const { data } = await axios.get<TvlResponse>(this.configService.get('MAYA_MIDGARD_URL') + '/history/tvl', {
      params: { interval: 'day', count },
    })

    return data
  }

  getThorchainMemberKpis = async (address: string, pool: string): Promise<PoolKpis | null> => {
    const { data: rawMember } = await axios.get<any>(
      this.configService.get('PUBLIC_TC_MIDGARD_URL') + '/member/' + address,
    )
    const member = marshallMemberInfo(pool, rawMember)
    if (!member) return null

    const { data: rawPoolInfo } = await axios.get<any>(
      this.configService.get('THORNODE_URL') + '/thorchain/pool/' + pool,
    )
    const poolInfo = marshallPoolInfo(rawPoolInfo)
    if (!poolInfo) return null

    const { data: rawRunePrice } = await axios.get<any>(
      this.configService.get('THORNODE_URL') + '/thorchain/pool/ETH.USDT-0XDAC17F958D2EE523A2206206994597C13D831EC7',
    )
    const runePrice = marshallRunePrice(rawRunePrice)
    if (!runePrice) return null

    const assetPrice = poolInfo.balanceRune.times(runePrice).div(poolInfo.balanceAsset)

    const { data: rawLp } = await axios.get<any>(
      this.configService.get('THORNODE_URL') + '/thorchain/pool/' + pool + '/liquidity_provider/' + address,
    )
    const lp = marshallLp(rawLp)
    if (!lp) return null

    const { data: rawActionsAdd } = await axios.get<any>(
      this.configService.get('PUBLIC_TC_MIDGARD_URL') +
        `/actions?type=addLiquidity&address=${member.assetAddress || member.runeAddress},${
          member.runeAddress || member.assetAddress
        }&asset=${pool}&offset=0&limit=50`,
    )
    console.log(
      this.configService.get('PUBLIC_TC_MIDGARD_URL') +
        `/actions?type=addLiquidity&address=${member.assetAddress || member.runeAddress},${
          member.runeAddress || member.assetAddress
        }&asset=${pool}&offset=0&limit=50`,
    )
    const actionsAdd = marshallMidgardActions(rawActionsAdd)
    if (!actionsAdd) return null

    const { data: rawActionsWithdraw } = await axios.get<any>(
      this.configService.get('PUBLIC_TC_MIDGARD_URL') +
        `/actions?type=withdraw&address=${member.assetAddress || member.runeAddress},${
          member.runeAddress || member.assetAddress
        }&asset=${pool}&offset=0&limit=50`,
    )
    const actionsWithdraw = marshallMidgardActions(rawActionsWithdraw)
    if (!actionsWithdraw) return null

    const allActions: MidgardAction[] = [...actionsAdd, ...actionsWithdraw]
    const sortedActions = allActions.sort(
      (a, b) => new BigNumber(a.date).div(1000).toNumber() - new BigNumber(b.date).div(1000).toNumber(),
    )

    const runeShift = lp.runeRedeemValue.minus(lp.runeDepositValue)
    const assetShift = lp.assetRedeemValue.minus(lp.assetDepositValue)
    const data: PoolKpis = {
      address: address,
      pool: pool,
      luviGrowthPercent: lp.luviGrowthPercent.toNumber(),
      runePrice: runePrice.toNumber(),
      assetPrice: assetPrice.toNumber(),
      assetShift: {
        rune: runeShift.toNumber(),
        asset: assetShift.toNumber(),
      },
      added: {
        rune: lp.runeDepositValue.toNumber(),
        asset: lp.assetDepositValue.toNumber(),
        runeUsd: 0,
        assetUsd: 0,
      },
      redeemable: {
        rune: lp.runeRedeemValue.toNumber(),
        asset: lp.assetRedeemValue.toNumber(),
        runeUsd: lp.runeRedeemValue.times(runePrice).toNumber(),
        assetUsd: lp.assetRedeemValue.times(assetPrice).toNumber(),
      },
      lpVsHodl: {
        usd: runePrice.times(runeShift).plus(assetPrice.times(assetShift)).toNumber(),
        percent: 0,
      },
    }

    let balanceAsset = new BigNumber(0)
    let balanceRune = new BigNumber(0)
    let liquidityUnits = new BigNumber(0)
    let totalUsd = new BigNumber(0)
    for (const i of sortedActions) {
      const timestamp = new BigNumber(i.date).div(10 ** 9).toFixed(0)

      const rawPrice = await this.getPriceForPoolAtInterval(pool, timestamp, timestamp)
      const price = marshallHistoryDepthsPriceInUsd(rawPrice)
      if (!price) return null

      if (i.type === 'addLiquidity' && i.metadata.addLiquidity) {
        liquidityUnits = liquidityUnits.plus(i.metadata.addLiquidity.liquidityUnits)
      } else if (i.type === 'withdraw' && i.metadata.withdraw.liquidityUnits) {
        liquidityUnits = liquidityUnits.minus(i.metadata.withdraw.liquidityUnits.replace('-', ''))
      }

      const coins = i.type === 'addLiquidity' ? i.in : i.out
      for (const c of coins) {
        if (i.type === 'addLiquidity') {
          if (c.coins && c.coins.length > 0) {
            if (c.coins[0].asset === 'THOR.RUNE') {
              balanceRune = balanceRune.plus(c.coins[0].amount)
              console.log(balanceRune.toString(), c.coins[0].amount)
              const addedInUsd = new BigNumber(c.coins[0].amount).div(10 ** RUNE_DECIMAL).times(price.runePriceUsd)
              totalUsd = totalUsd.plus(addedInUsd)
              if (c.coins.length === 1) {
                data.added.runeUsd += addedInUsd.div(2).toNumber()
                data.added.assetUsd += addedInUsd.div(2).toNumber()
              } else {
                data.added.runeUsd += addedInUsd.toNumber()
              }
            } else {
              balanceAsset = balanceAsset.plus(c.coins[0].amount)
              console.log(balanceAsset.toString(), c.coins[0].amount)
              const addedInUsd = new BigNumber(c.coins[0].amount).div(10 ** RUNE_DECIMAL).times(price.assetPriceUsd)
              totalUsd = totalUsd.plus(addedInUsd)
              if (c.coins.length === 1) {
                data.added.runeUsd += addedInUsd.div(2).toNumber()
                data.added.assetUsd += addedInUsd.div(2).toNumber()
              } else {
                data.added.assetUsd += addedInUsd.toNumber()
              }
            }
          }
        } else {
          if (c.coins && c.coins.length > 0) {
            if (c.coins[0].asset === 'THOR.RUNE') {
              balanceRune = balanceRune.minus(c.coins[0].amount)
              const removedInUsd = new BigNumber(c.coins[0].amount).div(10 ** RUNE_DECIMAL).times(price.runePriceUsd)
              totalUsd = totalUsd.minus(removedInUsd)
              data.added.runeUsd -= removedInUsd.div(2).toNumber()
              data.added.assetUsd -= removedInUsd.div(2).toNumber()
            } else {
              balanceAsset = balanceAsset.minus(c.coins[0].amount)
              const removedInUsd = new BigNumber(c.coins[0].amount).div(10 ** RUNE_DECIMAL).times(price.assetPriceUsd)
              data.added.runeUsd -= removedInUsd.div(2).toNumber()
              data.added.assetUsd -= removedInUsd.div(2).toNumber()
            }
          }
        }
      }
    }

    const redeemable = data.redeemable.assetUsd + data.redeemable.runeUsd
    const added = data.added.assetUsd + data.added.runeUsd
    data.lpVsHodl.percent = new BigNumber((redeemable * 100) / added).minus(100).toNumber()

    return data
  }

  getPriceForPoolAtInterval = async (pool: string, from: string, to: string): Promise<any> => {
    const priceCacheKey = `history-depths-${pool}-from-${from}-to-${to}`
    const rawPriceCache = await this.cacheManager.get<any>(priceCacheKey)
    if (rawPriceCache) {
      return rawPriceCache
    }

    const { data } = await axios.get<any>(
      this.configService.get('PUBLIC_TC_MIDGARD_URL') + `/history/depths/${pool}?from=${from}&to=${to}`,
    )
    await this.cacheManager.set(priceCacheKey, data, CACHE_TIME.hour * 24 * 365)
    return data
  }
}
