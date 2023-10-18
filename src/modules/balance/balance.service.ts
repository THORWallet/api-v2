import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { Balance } from './types/balance'
import { assetFromString } from '@xchainjs/xchain-util'
import { ETH_DECIMAL } from '../../constants'

@Injectable()
export class BalanceService {
  constructor(private readonly ethplorereApi: HttpService) {}

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
}
