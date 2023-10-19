import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { Balance } from './types/balance'
import { assetAmount, assetFromString, assetToBase } from '@xchainjs/xchain-util'
import {
  BCH_DECIMAL,
  BTC_DECIMAL,
  DASH_DECIMAL,
  DOGE_DECIMAL,
  ETH_DECIMAL,
  LTC_DECIMAL,
  chainIds,
  nativeChainAssetIcons,
  tickers,
} from '../../constants'
import axios from 'axios'
import { ConfigService } from '@nestjs/config'
import BigNumber from 'bignumber.js'

@Injectable()
export class BalanceService {
  constructor(
    private readonly ethplorereApi: HttpService,
    private readonly configService: ConfigService,
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
        icon: nativeChainAssetIcons.DASH,
        name: 'Dash',
        decimals: DASH_DECIMAL,
        usdPrice,
      },
      amount: confirmed.amount().toString(),
      rawAmount: raw.amount().toString(),
    }
  }
}
