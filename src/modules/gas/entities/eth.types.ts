import { ContractInterface } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'

export type EstimateCallGasLimitArgs = {
  contractAddress: string
  abi: ContractInterface
  fnName: string
  params: (string | string[])[]
  from?: string
  value?: BigNumber
}
