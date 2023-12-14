import { ContractInterface } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'
import { ApiProperty } from '@nestjs/swagger'

export type EstimateCallGasLimitArgs = {
  contractAddress: string
  abi: ContractInterface
  fnName: string
  params: (string | string[])[]
  from?: string
  value?: BigNumber
}

export class EthGasResponse {
  @ApiProperty({ description: 'The gas fee', type: String })
  gasFee: string

  @ApiProperty({ description: 'Chain id for the gasFee', type: Number })
  chainId: number
}
