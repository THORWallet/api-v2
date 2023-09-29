export interface PoolDetail {
  /**
   * Float, also called APR. Annual return estimated linearly (not compounded) from a period of typically
   * the last 30 or 100 days (configurable by the period parameter, default is 30). E.g. 0.1 means 10% yearly return.
   * Due to Impermanent Loss and Synths this might be negative, but given Impermanent Loss Protection for 100+
   * day members, frontends might show MAX(APR, 0).
   * @type {string}
   * @memberof PoolDetail
   */
  annualPercentageRate: string
  /**
   *
   * @type {string}
   * @memberof PoolDetail
   */
  asset: string
  /**
   * Int64(e8), the amount of Asset in the pool.
   * @type {string}
   * @memberof PoolDetail
   */
  assetDepth: string
  /**
   * Float, price of asset in rune. I.e. rune amount / asset amount.
   * @type {string}
   * @memberof PoolDetail
   */
  assetPrice: string
  /**
   * Float, the price of asset in USD (based on the deepest USD pool).
   * @type {string}
   * @memberof PoolDetail
   */
  assetPriceUSD: string
  /**
   * Int64, Liquidity Units in the pool.
   * @type {string}
   * @memberof PoolDetail
   */
  liquidityUnits: string
  /**
   * Float, Average Percentage Yield: annual return estimated using last weeks income, taking compound interest into account.
   * @type {string}
   * @memberof PoolDetail
   */
  poolAPY: string
  /**
   * Int64(e8), the amount of Rune in the pool.
   * @type {string}
   * @memberof PoolDetail
   */
  runeDepth: string
  /**
   * The state of the pool, e.g. Available, Staged.
   * @type {string}
   * @memberof PoolDetail
   */
  status: string
  /**
   * Int64, Synth supply in the pool.
   * @type {string}
   * @memberof PoolDetail
   */
  synthSupply: string
  /**
   * Int64, Synth Units in the pool.
   * @type {string}
   * @memberof PoolDetail
   */
  synthUnits: string
  /**
   * Int64, Total Units (synthUnits + liquidityUnits) in the pool.
   * @type {string}
   * @memberof PoolDetail
   */
  units: string
  /**
   * Int64(e8), the total volume of swaps in the last 24h to and from Rune denoted in Rune.
   * @type {string}
   * @memberof PoolDetail
   */
  volume24h: string
  /**
   * Int64(e8), the total synth locked in saver vault.
   * @type {string}
   * @memberof PoolDetail
   */
  saversDepth: string
  /**
   * Int64(e8), the units tracking savers vault ownership.
   * @type {string}
   * @memberof PoolDetail
   */
  saversUnits: string
  /**
   * Float, Average Percentage Yield: annual return estimated using last weeks income, taking compound interest into account.
   * @type {string}
   * @memberof PoolDetail
   */
  saversAPR: string
}
