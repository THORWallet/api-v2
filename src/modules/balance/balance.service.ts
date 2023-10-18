import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { Balance } from './types/balance'
import { assetAmount, assetFromString, assetToBase } from '@xchainjs/xchain-util'
import { BTC_DECIMAL, ETH_DECIMAL } from '../../constants'
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
      ETH: { balance, rawBalance },
      tokens,
    } = data

    const ethBalance: Balance = {
      asset: assetFromString('ETH.ETH'),
      amount: balance,
      rawAmount: rawBalance,
      decimals: ETH_DECIMAL,
    }
    const tokenBalances = tokens.map(({ tokenInfo, balance, rawBalance }) => {
      return {
        asset: assetFromString(`ETH.${tokenInfo.symbol}-${tokenInfo.address}`),
        balance: balance,
        rawAmount: rawBalance,
        decimals: parseInt(tokenInfo.decimals),
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
    console.log({ data })
    const addressData = data.data[address]
    const confirmed = assetAmount(new BigNumber(addressData.address.balance).div(10 ** BTC_DECIMAL), BTC_DECIMAL)
    const raw = assetToBase(confirmed)
    console.log({ confirmed: confirmed.amount().toString() })

    return {
      asset: assetFromString('BTC.BTC'),
      amount: confirmed.amount().toString(),
      rawAmount: raw.amount().toString(),
      decimals: BTC_DECIMAL,
    }
  }
}
