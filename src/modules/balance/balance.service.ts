import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { Balance } from './types/balance'
import { assetAmount, assetFromString, assetToBase } from '@xchainjs/xchain-util'
import { BTC_DECIMAL, ETH_DECIMAL, chainIds, nativeChainAssetIcons, tickers } from '../../constants'
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
    const confirmed = assetAmount(new BigNumber(addressData.address.balance).div(10 ** BTC_DECIMAL), BTC_DECIMAL)
    const raw = assetToBase(confirmed)
    const usdPrice = data.context.market_price_usd

    return {
      asset: {
        chain: 'BCH',
        ticker: 'BCH',
        icon: nativeChainAssetIcons.BCH,
        name: 'Bitcoin Cash',
        decimals: BTC_DECIMAL,
        usdPrice,
      },
      amount: confirmed.amount().toString(),
      rawAmount: raw.amount().toString(),
    }
  }
}
