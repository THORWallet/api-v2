import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BalancesResponse } from '@covalenthq/client-sdk'
import { BncClient } from '@binance-chain/javascript-sdk/lib/client'
import BigNumber from 'bignumber.js'
import axios from 'axios'
import { Balance, BalanceResponse, BnbBalance } from './types/balance'
import { assetAmount, assetFromString, assetToBase, baseAmount } from '@xchainjs/xchain-util'
import {
  BCH_DECIMAL,
  BNB_DECIMAL,
  BTC_DECIMAL,
  Chain,
  DASH_DECIMAL,
  DOGE_DECIMAL,
  ETH_DECIMAL,
  LTC_DECIMAL,
  THORCHAIN_DECIMAL,
  chainIds,
  nativeChainAssetIcons,
  runeDenom,
  tickers,
  kujiTokens,
  mayaDenom,
  cacaoDenom,
  MAYA_DECIMAL,
  CACAO_DECIMAL,
  kujiDenom,
} from '../../constants'
import { NodeInfoResponse } from '../api/types/thornode.types'
import { cosmosclient, proto, rest } from '@cosmos-client/core'
import { PoolService } from '../pool/pool.service'
import {
  AssetRuneNative,
  getCosmosAssetFromDenom,
  getDecimalsByAsset,
  getKujiraAssetFromDenom,
  getMayaAssetFromDenom,
} from '../asset/asset.helpers'
import { StatsService } from '../stats/stats.service'
import { PriceService } from '../price/price.service'

@Injectable()
export class BalanceService {
  constructor(
    private readonly ethplorereApi: HttpService,
    private readonly configService: ConfigService,
    private readonly tcPoolsService: PoolService,
    private readonly statsService: StatsService,
    private readonly priceService: PriceService,
  ) {}

  getBalancesForEthAddress = async (address: string): Promise<BalanceResponse> => {
    const { data } = await this.ethplorereApi.axiosRef.get(`getAddressInfo/${address}`)
    const {
      ETH: { balance, rawBalance, price },
      tokens = [],
    } = data

    const ethBalance: Balance = {
      asset: {
        chain: 'ETH',
        ticker: 'ETH',
        symbol: 'ETH',
        icon: nativeChainAssetIcons.ETH,
        name: 'Ethereum',
        decimals: ETH_DECIMAL,
        contractAddress: '',
        usdPrice: price?.rate || '',
        chainId: chainIds.Ethereum,
      },
      amount: balance,
      rawAmount: rawBalance,
    }
    const ethBalanceInUsd = new BigNumber(balance).times(new BigNumber(price?.rate) || 0)
    let tokenBalancesInUsd = new BigNumber(0)

    const tokenBalances: Balance[] = tokens
      .filter(({ tokenInfo }) => assetFromString(`ETH.${tokenInfo.symbol}-${tokenInfo.address}`))
      .map(({ tokenInfo, balance, rawBalance }) => {
        const { chain, ticker, symbol } = assetFromString(`ETH.${tokenInfo.symbol}-${tokenInfo.address}`)
        const [tickerName] = symbol.split('-')
        const tickerData = tickers.find((t) => t.ticker === tickerName)
        const amount = new BigNumber(balance).div(10 ** tokenInfo.decimals)
        const amountInUsd = amount.times(new BigNumber(tokenInfo.price?.rate || 0))

        tokenBalancesInUsd = tokenBalancesInUsd.plus(amountInUsd)

        return {
          asset: {
            chain,
            ticker,
            icon: tickerData?.icon || '',
            name: tickerData?.name || '',
            symbol,
            decimals: tokenInfo.decimals,
            contractAddress: tokenInfo.address,
            usdPrice: tokenInfo.price?.rate || '',
            chainId: chainIds.Ethereum,
          },
          amount: amount.toString(),
          rawAmount: rawBalance,
        }
      })

    return { balances: [ethBalance, ...tokenBalances], totalInUsd: ethBalanceInUsd.plus(tokenBalancesInUsd).toString() }
  }

  getBtcBalanceForAddress = async (address: string): Promise<BalanceResponse> => {
    const { data } = await axios.get(
      this.configService.get('BLOCKCHAIR_URL') +
        '/bitcoin' +
        `/dashboards/address/${address}?key=${this.configService.get('BLOCKCHAIR_KEY')}`,
    )

    const addressData = data.data[address]
    const confirmed = assetAmount(new BigNumber(addressData.address.balance).div(10 ** BTC_DECIMAL), BTC_DECIMAL)
    const raw = assetToBase(confirmed)
    const usdPrice = data.context.market_price_usd

    return {
      balances: [
        {
          asset: {
            chain: 'BTC',
            ticker: 'BTC',
            symbol: 'BTC',
            icon: nativeChainAssetIcons.BTC,
            name: 'Bitcoin',
            decimals: BTC_DECIMAL,
            usdPrice,
          },
          amount: confirmed.amount().toString(),
          rawAmount: raw.amount().toString(),
        },
      ],
      totalInUsd: confirmed.amount().times(usdPrice).toString(),
    }
  }

  getBchBalanceForAddress = async (address: string): Promise<BalanceResponse> => {
    const { data } = await axios.get(
      this.configService.get('BLOCKCHAIR_URL') +
        '/bitcoin-cash' +
        `/dashboards/address/${address}?key=${this.configService.get('BLOCKCHAIR_KEY')}`,
    )

    const addressData = data.data[address]
    const confirmed = assetAmount(new BigNumber(addressData.address.balance).div(10 ** BCH_DECIMAL), BCH_DECIMAL)
    const raw = assetToBase(confirmed)
    const usdPrice = data.context.market_price_usd

    return {
      balances: [
        {
          asset: {
            chain: 'BCH',
            ticker: 'BCH',
            symbol: 'BCH',
            icon: nativeChainAssetIcons.BCH,
            name: 'Bitcoin Cash',
            decimals: BCH_DECIMAL,
            usdPrice,
          },
          amount: confirmed.amount().toString(),
          rawAmount: raw.amount().toString(),
        },
      ],
      totalInUsd: confirmed.amount().times(usdPrice).toString(),
    }
  }

  getLtcBalanceForAddress = async (address: string): Promise<BalanceResponse> => {
    const { data } = await axios.get(
      this.configService.get('BLOCKCHAIR_URL') +
        '/litecoin' +
        `/dashboards/address/${address}?key=${this.configService.get('BLOCKCHAIR_KEY')}`,
    )

    const addressData = data.data[address]
    const confirmed = assetAmount(new BigNumber(addressData.address.balance).div(10 ** LTC_DECIMAL), LTC_DECIMAL)
    const raw = assetToBase(confirmed)
    const usdPrice = data.context.market_price_usd

    return {
      balances: [
        {
          asset: {
            chain: 'LTC',
            ticker: 'LTC',
            symbol: 'LTC',
            icon: nativeChainAssetIcons.LTC,
            name: 'Litecoin',
            decimals: LTC_DECIMAL,
            usdPrice,
          },
          amount: confirmed.amount().toString(),
          rawAmount: raw.amount().toString(),
        },
      ],
      totalInUsd: confirmed.amount().times(usdPrice).toString(),
    }
  }

  getDogeBalanceForAddress = async (address: string): Promise<BalanceResponse> => {
    const { data } = await axios.get(
      this.configService.get('BLOCKCHAIR_URL') +
        '/dogecoin' +
        `/dashboards/address/${address}?key=${this.configService.get('BLOCKCHAIR_KEY')}`,
    )

    const addressData = data.data[address]
    const confirmed = assetAmount(new BigNumber(addressData.address.balance).div(10 ** DOGE_DECIMAL), DOGE_DECIMAL)
    const raw = assetToBase(confirmed)
    const usdPrice = data.context.market_price_usd

    return {
      balances: [
        {
          asset: {
            chain: 'DOGE',
            ticker: 'DOGE',
            symbol: 'DOGE',
            icon: nativeChainAssetIcons.DOGE,
            name: 'Dogecoin',
            decimals: DOGE_DECIMAL,
            usdPrice,
          },
          amount: confirmed.amount().toString(),
          rawAmount: raw.amount().toString(),
        },
      ],
      totalInUsd: confirmed.amount().times(usdPrice).toString(),
    }
  }

  getDashBalanceForAddress = async (address: string): Promise<BalanceResponse> => {
    const { data } = await axios.get(
      this.configService.get('BLOCKCHAIR_URL') +
        '/dash' +
        `/dashboards/address/${address}?key=${this.configService.get('BLOCKCHAIR_KEY')}`,
    )

    const addressData = data.data[address]
    const confirmed = assetAmount(new BigNumber(addressData.address.balance).div(10 ** DASH_DECIMAL), DASH_DECIMAL)
    const raw = assetToBase(confirmed)
    const usdPrice = data.context.market_price_usd

    return {
      balances: [
        {
          asset: {
            chain: 'DASH',
            ticker: 'DASH',
            symbol: 'DASH',
            icon: nativeChainAssetIcons.DASH,
            name: 'Dash',
            decimals: DASH_DECIMAL,
            usdPrice,
          },
          amount: confirmed.amount().toString(),
          rawAmount: raw.amount().toString(),
        },
      ],
      totalInUsd: confirmed.amount().times(usdPrice).toString(),
    }
  }

  getTcChainId = async (): Promise<string> => {
    const nodeUrl = this.configService.get('THORNODE_URL')
    const { data } = await axios.get<NodeInfoResponse>(`${nodeUrl}/cosmos/base/tendermint/v1beta1/node_info`)
    return data?.default_node_info?.network || Promise.reject(new Error('Could not parse chain id'))
  }

  getMayaChainId = async (): Promise<string> => {
    const nodeUrl = this.configService.get('MAYANODE_URL')
    const { data } = await axios.get<NodeInfoResponse>(`${nodeUrl}/cosmos/base/tendermint/v1beta1/node_info`)
    return data?.default_node_info?.network || Promise.reject(new Error('Could not parse chain id'))
  }

  getSdkBalance = async ({
    address,
    server,
    chainId,
    prefix,
  }: {
    address: string
    server: string
    chainId: string
    prefix: string
  }): Promise<proto.cosmos.base.v1beta1.Coin[]> => {
    cosmosclient.config.setBech32Prefix({
      accAddr: prefix,
      accPub: prefix + 'pub',
      valAddr: prefix + 'valoper',
      valPub: prefix + 'valoperpub',
      consAddr: prefix + 'valcons',
      consPub: prefix + 'valconspub',
    })

    const accAddress = cosmosclient.AccAddress.fromString(address)
    const sdk = new cosmosclient.CosmosSDK(server, chainId)

    const response = await rest.bank.allBalances(sdk, accAddress)
    return response.data.balances as proto.cosmos.base.v1beta1.Coin[]
  }

  getThorchainBalanceForAddress = async (address: string): Promise<BalanceResponse> => {
    const networkId = await this.getTcChainId()
    const balances = await this.getSdkBalance({
      address,
      server: this.configService.get('THORNODE_URL'),
      chainId: networkId,
      prefix: 'thor',
    })

    const pools = await this.tcPoolsService.getThorchainMidgardPools()
    const tcStats = await this.statsService.getTcStats()

    if (balances.length === 0) {
      balances.push({ denom: 'rune', amount: '0' } as unknown as proto.cosmos.base.v1beta1.Coin)
    }

    let totalBalanceInUsd = new BigNumber(0)

    const assets = balances.map((balance) => {
      const { denom: _denom, amount } = balance
      const denom = _denom.toUpperCase()
      const asset = _denom === runeDenom ? AssetRuneNative : assetFromString(denom)

      const [tickerName] = asset.symbol.split('-')
      const tickerData = tickers.find((t) => t.ticker === tickerName)

      // TODO use map instead of find
      const assetPrice =
        denom.toUpperCase() === runeDenom.toUpperCase()
          ? tcStats.runePriceUSD
          : pools.find((p) => p.asset === `${denom.replace('/', '.').toUpperCase()}`)?.assetPriceUSD || ''

      const assetAmount = new BigNumber(amount).div(10 ** THORCHAIN_DECIMAL)

      const assetBalanceInUsd = assetAmount.times(assetPrice)
      totalBalanceInUsd = totalBalanceInUsd.plus(assetBalanceInUsd)

      return {
        asset: {
          chain: asset?.chain,
          ticker: asset?.ticker,
          symbol: asset?.symbol,
          icon: tickerData?.icon || '',
          name: tickerData?.name || '',
          decimals: THORCHAIN_DECIMAL,
          usdPrice: assetPrice,
          isSynthetic: asset.synth,
        },
        amount: assetAmount.toString(),
        rawAmount: amount,
      }
    })

    return { balances: assets, totalInUsd: totalBalanceInUsd.toString() }
  }

  getBnbBalanceForAddress = async (address: string): Promise<BalanceResponse> => {
    const client = new BncClient(this.configService.get('BNB_CLIENT_URL'))
    const rawBalances: BnbBalance[] = await client.getBalance(address)
    if (rawBalances.length === 0) {
      rawBalances.push({
        free: '0',
        frozen: '0',
        locked: '0',
        symbol: 'BNB',
      })
    }
    const usdPrices = await this.priceService.fetchPricesFromCoingecko(
      rawBalances.map((balance) => assetFromString(`BNB.${balance.symbol}`)),
    )
    let totalBalanceInUsd = new BigNumber(0)
    const balances = rawBalances.map((balance) => {
      const asset = assetFromString(`BNB.${balance.symbol}`)
      const [tickerName] = asset.symbol.split('-')
      const tickerData = tickers.find((t) => t.ticker === tickerName)
      const assetPrice = usdPrices[asset.ticker].toString() || '0'
      const assetAmount = balance.free
      const assetBalanceInUsd = new BigNumber(assetAmount).times(assetPrice)
      totalBalanceInUsd = totalBalanceInUsd.plus(assetBalanceInUsd)

      return {
        asset: {
          chain: asset?.chain,
          ticker: asset.ticker,
          symbol: asset.symbol,
          icon: tickerData?.icon || '',
          name: tickerData?.name || '',
          decimals: BNB_DECIMAL,
          usdPrice: assetPrice,
        },
        amount: balance.free,
        rawAmount: balance.free,
      }
    })

    return { balances, totalInUsd: totalBalanceInUsd.toString() }
  }

  getBscBalanceForAddress = async (address: string): Promise<BalanceResponse> => {
    const covalentKey = this.configService.get('COVALENT_API_KEY')
    const covalentApiUrl = this.configService.get('COVALENT_API_URL')

    const { data: rawBalances } = await axios.get<{ data: BalancesResponse }>(
      `${covalentApiUrl}/56/address/${address}/balances_v2/?key=${covalentKey}`,
    )

    let totalBalanceInUsd = new BigNumber(0)

    const balances: Balance[] = rawBalances.data.items.map((balance) => {
      const asset = assetFromString(`BSC.${balance.contract_ticker_symbol}`)
      const amount = new BigNumber(balance.balance.toString()).div(10 ** balance.contract_decimals).toString()
      const assetPrice = balance.quote_rate?.toString() || '0'
      const assetBalanceInUsd = new BigNumber(amount).times(assetPrice)
      totalBalanceInUsd = totalBalanceInUsd.plus(assetBalanceInUsd)

      return {
        asset: {
          chain: Chain.Bsc,
          ticker: asset.ticker,
          symbol: asset.symbol,
          icon: balance.logo_url,
          name: balance.contract_name,
          decimals: balance.contract_decimals,
          usdPrice: assetPrice,
          contractAddress: balance.contract_address,
        },
        amount,
        rawAmount: balance.balance.toString(),
      }
    })

    return { balances, totalInUsd: totalBalanceInUsd.toString() }
  }

  getAvalancheBalanceForAddress = async (address: string): Promise<BalanceResponse> => {
    const covalentKey = this.configService.get('COVALENT_API_KEY')
    const covalentApiUrl = this.configService.get('COVALENT_API_URL')

    const { data: rawBalances } = await axios.get<{ data: BalancesResponse }>(
      `${covalentApiUrl}/43114/address/${address}/balances_v2/?key=${covalentKey}`,
    )

    let totalBalanceInUsd = new BigNumber(0)

    const balances: Balance[] = rawBalances.data.items.map((balance) => {
      const asset = assetFromString(`AVAX.${balance.contract_ticker_symbol}`)
      const amount = new BigNumber(balance.balance.toString()).div(10 ** balance.contract_decimals).toString()
      const assetPrice = balance.quote_rate?.toString() || '0'
      const assetBalanceInUsd = new BigNumber(amount).times(assetPrice)
      totalBalanceInUsd = totalBalanceInUsd.plus(assetBalanceInUsd)

      return {
        asset: {
          chain: Chain.Avalanche,
          ticker: asset.ticker,
          symbol: asset.symbol,
          icon: balance.logo_url,
          name: balance.contract_name,
          decimals: balance.contract_decimals,
          usdPrice: assetPrice,
          contractAddress: balance.contract_address,
        },
        amount,
        rawAmount: balance.balance.toString(),
      }
    })

    return { balances, totalInUsd: totalBalanceInUsd.toString() }
  }

  getCosmosBalanceForAddress = async (address: string): Promise<BalanceResponse> => {
    const balances = await this.getSdkBalance({
      address,
      server: this.configService.get('COSMOS_SERVER_URL'),
      chainId: 'cosmoshub-4',
      prefix: 'cosmos',
    })
    if (balances.length === 0) {
      balances.push({ denom: 'uatom', amount: '0' } as unknown as proto.cosmos.base.v1beta1.Coin)
    }
    const assetPrices = await this.priceService.fetchPricesFromCoingecko(
      balances.map((balance) => getCosmosAssetFromDenom(balance.denom)),
    )
    let totalBalanceInUsd = new BigNumber(0)
    const assets = balances
      .filter((b) => b.denom === 'uatom')
      .map((balance) => {
        const { denom, amount } = balance
        const asset = getCosmosAssetFromDenom(denom)
        const [tickerName] = asset.symbol.split('-')
        const tickerData = tickers.find((t) => t.ticker === tickerName)
        const decimals = getDecimalsByAsset(asset)

        const assetBalanceInUsd = new BigNumber(amount).times(assetPrices[asset.ticker] || 0)
        totalBalanceInUsd = totalBalanceInUsd.plus(assetBalanceInUsd)
        return {
          asset: {
            chain: asset?.chain,
            ticker: asset?.ticker,
            symbol: asset?.symbol,
            icon: tickerData?.icon || '',
            name: tickerData?.name || '',
            decimals,
            usdPrice: assetPrices[asset.ticker] ? assetPrices[asset.ticker].toString() : '0',
            isSynthetic: false,
          },
          amount: new BigNumber(amount).div(10 ** decimals).toString(),
          rawAmount: amount,
        }
      })

    return { balances: assets, totalInUsd: totalBalanceInUsd.toString() }
  }

  getMayaBalanceForAddress = async (address: string): Promise<BalanceResponse> => {
    const chainId = await this.getMayaChainId()

    const balances = await this.getSdkBalance({
      address,
      server: this.configService.get('MAYANODE_URL'),
      chainId,
      prefix: 'maya',
    })

    if (balances.length === 0) {
      balances.push({ denom: 'cacao', amount: '0' } as unknown as proto.cosmos.base.v1beta1.Coin)
    }

    const pools = await this.tcPoolsService.getMayaMidgardPools()
    const mayaStats = await this.statsService.getTcStats()

    let totalBalanceInUsd = new BigNumber(0)

    const assets = balances.map((balance) => {
      const { denom, amount } = balance
      const asset = getMayaAssetFromDenom(denom)

      const [tickerName] = asset.symbol.split('-')
      const tickerData = tickers.find((t) => t.ticker === tickerName)

      const assetPrice =
        denom === mayaDenom
          ? '40'
          : denom === cacaoDenom
          ? mayaStats.runePriceUSD
          : pools.find((p) => p.asset === `${denom.replace('/', '.').toUpperCase()}`)?.assetPriceUSD || ''
      const decimal = denom === mayaDenom ? MAYA_DECIMAL : CACAO_DECIMAL

      const assetAmount = new BigNumber(amount).div(10 ** decimal)
      totalBalanceInUsd = assetAmount.times(assetPrice)

      return {
        asset: {
          chain: asset?.chain,
          ticker: asset?.ticker,
          symbol: asset?.symbol,
          icon: tickerData?.icon || '',
          name: tickerData?.name || '',
          decimals: decimal,
          usdPrice: assetPrice,
          isSynthetic: asset.synth,
        },
        amount: assetAmount.toString(),
        rawAmount: amount,
      }
    })

    return { balances: assets, totalInUsd: totalBalanceInUsd.toString() }
  }

  getKujiraBalanceForAddress = async (address: string): Promise<BalanceResponse> => {
    const tradableBalances = { ...kujiTokens }
    const chainId = 'kaiyo-1'

    const balances = await this.getSdkBalance({
      address,
      server: this.configService.get('KUJIRA_NODE_URL'),
      chainId,
      prefix: 'kujira',
    })
    if (balances.length === 0) {
      balances.push({ denom: kujiDenom, amount: '0' } as unknown as proto.cosmos.base.v1beta1.Coin)
    }

    let totalBalanceInUsd = new BigNumber(0)

    const mappedBalances = balances.map((balance) => {
      const info = getKujiraAssetFromDenom(balance.denom)

      return (tradableBalances[`${info.asset.chain}.${info.asset.ticker}`] = {
        asset: info?.asset,
        amount: baseAmount(balance?.amount, info?.decimals || 0),
        decimals: info?.decimals,
      })
    })

    const usdPrices = await this.priceService.fetchPricesFromCoingecko(mappedBalances.map((balance) => balance.asset))

    const apiBalances = mappedBalances.map((t) => {
      const assetPrice = usdPrices[t.asset.ticker].toString() || '0'
      const assetAmount = t.amount
        .amount()
        .div(10 ** t.decimals)
        .toString()

      const assetBalanceInUsd = new BigNumber(assetAmount).times(assetPrice)
      totalBalanceInUsd = totalBalanceInUsd.plus(assetBalanceInUsd)

      return {
        asset: {
          chain: t?.asset.chain,
          ticker: t?.asset.ticker,
          symbol: t?.asset.symbol,
          icon: '',
          name: '',
          decimals: t.decimals,
          usdPrice: assetPrice,
          isSynthetic: false,
        },
        amount: assetAmount,
        rawAmount: t.amount.amount().toString(),
      }
    })

    return { balances: apiBalances, totalInUsd: totalBalanceInUsd.toString() }
  }
}
