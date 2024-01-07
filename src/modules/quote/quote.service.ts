import { Injectable } from '@nestjs/common'
import { GetSwapQuoteDto, SwapQuoteResponse } from './entitites/quote.dto'
import { getPoolForAsset } from '../pool/helpers/lp-helper'
import { PoolService } from '../pool/pool.service'
import { StatsService } from '../stats/stats.service'
import BigNumber from 'bignumber.js'
import { isRuneNativeAssetString } from '../asset/asset.helpers'
import { formatMidgardNumber } from '../../utils'
import { MIDGARD_DECIMAL } from '../../constants'
import { NodeSwapQuoteResponse } from '../../types/node/node.response'
import { ConfigService } from '@nestjs/config'
import { CACAO_MULTIPLIER, DEFAULT_STREAMING_INTERVAL } from './quote.constants'
import axios from 'axios'

@Injectable()
export class QuoteService {
  constructor(
    private readonly poolService: PoolService,
    private readonly statsService: StatsService,
    private readonly configService: ConfigService,
  ) {}

  // https://dev.thorchain.org/thorchain-dev/concepts/streaming-swaps
  async getStreamingSwapParams(params: GetSwapQuoteDto): Promise<number> {
    const { fromAsset, toAsset, amount } = params
    const tcPools = await this.poolService.getThorchainMidgardPools()
    const tcMimir = await this.statsService.getTcMimirStats()
    const fromAssetPool = getPoolForAsset(tcPools, params.fromAsset)
    const toAssetPool = getPoolForAsset(tcPools, params.toAsset)
    const assetPriceInRune = new BigNumber(fromAssetPool.assetPrice)

    const fromRune = isRuneNativeAssetString(fromAsset)
    const toRune = isRuneNativeAssetString(toAsset)

    if (!tcMimir) return
    const { STREAMINGSWAPMINBPFEE: minBPStreamingSwap } = tcMimir

    const minStreamingSwapBp = new BigNumber(minBPStreamingSwap).div(10000)

    const rawAmount = new BigNumber(amount).times(10 ** MIDGARD_DECIMAL)

    if (fromRune || toRune) {
      const pool = fromRune ? toAssetPool : fromAssetPool
      const poolDepth = formatMidgardNumber(pool.runeDepth)
      const minimumSwapSize = poolDepth.times(minStreamingSwapBp)

      const runeValue = fromRune ? rawAmount : assetPriceInRune.times(rawAmount).div(10 ** MIDGARD_DECIMAL)

      const swapCount = Math.floor(runeValue.dividedBy(minimumSwapSize).toNumber())

      if (swapCount > 1600) {
        return 1600
      }

      return swapCount
    }

    const toAssetPoolRuneDepth = formatMidgardNumber(toAssetPool?.runeDepth)
    const fromAssetPoolRuneDepth = formatMidgardNumber(fromAssetPool?.runeDepth)
    const virtualRuneDepthFromulaPartA = fromAssetPoolRuneDepth.times(toAssetPoolRuneDepth.times(2))

    const virtualRuneDepthFromulaPartB = toAssetPoolRuneDepth.plus(fromAssetPoolRuneDepth)

    const virtualRuneDepth = virtualRuneDepthFromulaPartA.div(virtualRuneDepthFromulaPartB)

    const minSwapSize = virtualRuneDepth.times(minStreamingSwapBp.div(2))
    const runeValueOfTheSwap = assetPriceInRune.times(rawAmount).div(10 ** MIDGARD_DECIMAL)

    const swapCount = Math.floor(runeValueOfTheSwap.div(minSwapSize).toNumber())

    if (swapCount > 1600) {
      return 1600
    }

    return swapCount
  }

  async getTcSwapQuote(
    params: GetSwapQuoteDto,
    isStreaming: boolean,
  ): Promise<{ error: string | null; quote: NodeSwapQuoteResponse }> {
    try {
      const { fromAsset, toAsset, amount, destination, fromAddress, toleranceBps, affiliateBps } = params
      const streamingQuantity = isStreaming ? await this.getStreamingSwapParams(params) : 0

      const requestParams = {
        from_asset: fromAsset.replace('THOR.RUNE', 'RUNE'),
        to_asset: toAsset.replace('THOR.RUNE', 'RUNE'),
        amount: Math.floor(amount * 10 ** MIDGARD_DECIMAL),
        destination,
        ...(fromAsset.includes('RUNE') || toAsset.includes('RUNE') || toAsset.includes('/') || fromAsset.includes('/')
          ? {}
          : { tolerance_bps: toleranceBps }),
        affiliate: this.configService.get<string>('AFFILIATE_ADDRESS'),
        affiliate_bps: affiliateBps,
        from_address: fromAddress,
        ...(isStreaming ? { streaming_interval: DEFAULT_STREAMING_INTERVAL } : {}),
        ...(isStreaming ? { streaming_quantity: streamingQuantity } : {}),
      }

      const nodeUrl = this.configService.get('THORNODE_URL')

      const { data } = await axios.get<NodeSwapQuoteResponse>(`${nodeUrl}/thorchain/quote/swap`, {
        params: requestParams,
      })
      return { error: null, quote: data }
    } catch (e) {
      return { error: e.message, quote: null }
    }
  }

  async getMayaSwapQuote(params: GetSwapQuoteDto): Promise<{ error: null | string; quote: NodeSwapQuoteResponse }> {
    try {
      const { fromAsset, toAsset, amount, destination, toleranceBps, affiliateBps } = params
      const swapQuoteParams = {
        from_asset: fromAsset,
        to_asset: toAsset,
        amount: fromAsset.includes('CACAO')
          ? Math.floor(amount * CACAO_MULTIPLIER * 10 ** MIDGARD_DECIMAL)
          : Math.floor(amount * 10 ** MIDGARD_DECIMAL),
        destination,
        ...(fromAsset.includes('CACAO') ||
        fromAsset.includes('MAYA') ||
        toAsset.includes('CACAO') ||
        toAsset.includes('MAYA') ||
        toAsset.includes('/') ||
        fromAsset.includes('/')
          ? {}
          : { tolerance_bps: toleranceBps }),
        affiliate: this.configService.get<string>('AFFILIATE_ADDRESS'),
        affiliate_bps: affiliateBps,
      }

      const mayaUrl = this.configService.get('MAYANODE_URL')

      const { data } = await axios.get<NodeSwapQuoteResponse>(`${mayaUrl}/mayachain/quote/swap`, {
        params: swapQuoteParams,
      })
      return { error: null, quote: data }
    } catch (e) {
      return { error: e.message, quote: null }
    }
  }

  async getSwapQuotes(params: GetSwapQuoteDto): Promise<SwapQuoteResponse> {
    const tcQuote = await this.getTcSwapQuote(params, false)
    const tcStreamingQuote = await this.getTcSwapQuote(params, true)
    const mayaQuote = await this.getMayaSwapQuote(params)

    return {
      thorchain: {
        base: tcQuote,
        streaming: tcStreamingQuote,
      },
      maya: mayaQuote,
    }
  }
}
