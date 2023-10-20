import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BalancesResponse, CovalentClient } from '@covalenthq/client-sdk'
import { BncClient } from '@binance-chain/javascript-sdk/lib/client'
import BigNumber from 'bignumber.js'
import axios from 'axios'
import { Balance, BnbBalance } from './types/balance'
import { assetAmount, assetFromString, assetToBase } from '@xchainjs/xchain-util'
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
} from '../../constants'
import { NodeInfoResponse } from '../api/types/thornode.types'
import { cosmosclient, proto, rest } from '@cosmos-client/core'
import { PoolService } from '../pool/pool.service'
import { AssetRuneNative } from '../asset/asset.helpers'
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

  getBalancesForEthAddress = async (address: string): Promise<Balance[]> => {
    const { data } = await this.ethplorereApi.axiosRef.get(`getAddressInfo/${address}`)
    const {
      ETH: { balance, rawBalance, price },
      tokens,
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
    const tokenBalances: Balance[] = tokens
      .filter(({ tokenInfo }) => assetFromString(`ETH.${tokenInfo.symbol}-${tokenInfo.address}`))
      .map(({ tokenInfo, balance, rawBalance }) => {
        const { chain, ticker, symbol } = assetFromString(`ETH.${tokenInfo.symbol}-${tokenInfo.address}`)
        const [tickerName] = symbol.split('-')
        const tickerData = tickers.find((t) => t.ticker === tickerName)

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
          amount: new BigNumber(balance).div(10 ** tokenInfo.decimals).toString(),
          rawAmount: rawBalance,
        }
      })
    return [ethBalance, ...tokenBalances]
  }

  getBtcBalanceForAddress = async (address: string): Promise<Balance> => {
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
    }
  }

  getBchBalanceForAddress = async (address: string): Promise<Balance> => {
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
    }
  }

  getLtcBalanceForAddress = async (address: string): Promise<Balance> => {
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
    }
  }

  getDogeBalanceForAddress = async (address: string): Promise<Balance> => {
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
    }
  }

  getDashBalanceForAddress = async (address: string): Promise<Balance> => {
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
    }
  }

  getTcChainId = async (): Promise<string> => {
    const nodeUrl = this.configService.get('THORNODE_URL')
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

  getThorchainBalanceForAddress = async (address: string): Promise<any> => {
    const networkId = await this.getTcChainId()
    const balances = await this.getSdkBalance({
      address,
      server: this.configService.get('THORNODE_URL'),
      chainId: networkId,
      prefix: 'thor',
    })

    const pools = await this.tcPoolsService.getThorchainMidgardPools()
    const tcStats = await this.statsService.getTcStats()

    const assets = balances.map((balance) => {
      const { denom: _denom, amount } = balance
      const denom = _denom.toUpperCase()
      const asset = _denom === runeDenom ? AssetRuneNative : assetFromString(denom)

      const [tickerName] = asset.symbol.split('-')
      const tickerData = tickers.find((t) => t.ticker === tickerName)

      const assetPrice =
        denom === runeDenom
          ? tcStats.runePriceUSD
          : pools.find((p) => p.asset === `${denom.replace('/', '.').toUpperCase()}`)?.assetPriceUSD || ''

      return {
        asset: {
          chain: asset?.chain,
          ticker: asset?.ticker,
          symbol: asset?.symbol,
          icon: tickerData?.icon || '',
          name: tickerData?.name || '',
          decimals: THORCHAIN_DECIMAL,
          usdPrice: assetPrice,
          isSynthetic: true,
        },
        amount: new BigNumber(amount).div(10 ** THORCHAIN_DECIMAL).toString(),
        rawAmount: amount,
      }
    })

    return assets
  }

  getBnbBalanceForAddress = async (address: string): Promise<Balance[]> => {
    const client = new BncClient(this.configService.get('BNB_CLIENT_URL'))
    const rawBalances: BnbBalance[] = await client.getBalance(address)
    const usdPrices = await this.priceService.fetchPricesFromCoingecko(
      rawBalances.map((balance) => assetFromString(`BNB.${balance.symbol}`)),
    )

    const balances = rawBalances.map((balance) => {
      const asset = assetFromString(`BNB.${balance.symbol}`)
      const [tickerName] = asset.symbol.split('-')
      const tickerData = tickers.find((t) => t.ticker === tickerName)

      return {
        asset: {
          chain: asset?.chain,
          ticker: asset.ticker,
          symbol: asset.symbol,
          icon: tickerData?.icon || '',
          name: tickerData?.name || '',
          decimals: BNB_DECIMAL,
          usdPrice: usdPrices[asset.ticker] ? usdPrices[asset.ticker].toString() : '',
        },
        amount: balance.free,
        rawAmount: balance.free,
      }
    })

    return balances
  }

  getBscBalanceForAddress = async (address: string): Promise<Balance[]> => {
    const covalentKey = this.configService.get('COVALENT_API_KEY')
    const covalentApiUrl = this.configService.get('COVALENT_API_URL')

    const { data: rawBalances } = await axios.get<{ data: BalancesResponse }>(
      `${covalentApiUrl}/56/address/${address}/balances_v2/?key=${covalentKey}`,
    )

    const balances: Balance[] = rawBalances.data.items.map((balance) => {
      const asset = assetFromString(`BSC.${balance.contract_ticker_symbol}`)

      return {
        asset: {
          chain: Chain.Bsc,
          ticker: asset.ticker,
          symbol: asset.symbol,
          icon: balance.logo_url,
          name: balance.contract_name,
          decimals: balance.contract_decimals,
          usdPrice: balance.quote_rate?.toString() || '',
          contractAddress: balance.contract_address,
        },
        amount: new BigNumber(balance.balance.toString()).div(10 ** balance.contract_decimals).toString(),
        rawAmount: balance.balance.toString(),
      }
    })

    return balances
  }

  getAvalancheBalanceForAddress = async (address: string): Promise<Balance[]> => {
    const covalentKey = this.configService.get('COVALENT_API_KEY')
    const covalentApiUrl = this.configService.get('COVALENT_API_URL')

    const { data: rawBalances } = await axios.get<{ data: BalancesResponse }>(
      `${covalentApiUrl}/43114/address/${address}/balances_v2/?key=${covalentKey}`,
    )

    const balances: Balance[] = rawBalances.data.items.map((balance) => {
      const asset = assetFromString(`AVAX.${balance.contract_ticker_symbol}`)

      return {
        asset: {
          chain: Chain.Avalanche,
          ticker: asset.ticker,
          symbol: asset.symbol,
          icon: balance.logo_url,
          name: balance.contract_name,
          decimals: balance.contract_decimals,
          usdPrice: balance.quote_rate?.toString() || '',
          contractAddress: balance.contract_address,
        },
        amount: new BigNumber(balance.balance.toString()).div(10 ** balance.contract_decimals).toString(),
        rawAmount: balance.balance.toString(),
      }
    })

    return balances
  }
}
