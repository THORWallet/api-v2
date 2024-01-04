import { Injectable } from '@nestjs/common'
import { StaticJsonRpcProvider } from '@ethersproject/providers'
import { HttpException, HttpStatus } from '@nestjs/common'
import { GasFeeType, GasResponse, GetGasDto } from '../entities/gas.dto'
import { BigNumber } from '@ethersproject/bignumber'
import { toUtf8Bytes } from '@ethersproject/strings'
import { Contract } from '@ethersproject/contracts'
import { EstimateCallGasLimitArgs } from '../entities'
import { erc20ABI } from '../../../constants'
import { ethRpcs } from '../../../constants/eth-rpcs.constatns'
import { SupportedChainIds } from '../../../commands/assets/helpers/helpers'

@Injectable()
export class AvaxGasService {
  constructor() {
    this.infuraProvider = new StaticJsonRpcProvider(ethRpcs[SupportedChainIds.Avalanche].rpcUrl, {
      chainId: SupportedChainIds.Avalanche,
      name: ethRpcs[SupportedChainIds.Avalanche].networkName,
    })
  }

  private infuraProvider: StaticJsonRpcProvider

  async getGasFee(getGasDto: GetGasDto): Promise<GasResponse> {
    const isErc20 = getGasDto.asset.contractAddress !== undefined
    const { asset } = getGasDto
    const chainId = SupportedChainIds.Avalanche
    if (isErc20) {
      const gasFee = await this.getErc20TransferGasFee(getGasDto)

      return {
        gasFees: { average: gasFee, fast: gasFee, fastest: gasFee },
        baseFee: gasFee,
        chainId,
        type: GasFeeType.AVAX_FEES,
      }
    }

    if (asset.chain !== 'AVAX' && asset.ticker !== 'AVAX') {
      throw new HttpException('Invalid asset', HttpStatus.BAD_REQUEST)
    }

    const gasFee = await this.getNativeGasFee(getGasDto)

    return {
      gasFees: { average: gasFee, fast: gasFee, fastest: gasFee },
      baseFee: gasFee,
      chainId,
      type: GasFeeType.AVAX_FEES,
    }
  }

  estimateCallGasLimit = async (args: EstimateCallGasLimitArgs): Promise<BigNumber> => {
    const { contractAddress, abi, fnName, params, from, value } = args

    const contract = new Contract(contractAddress, abi, this.infuraProvider)
    const method = contract.estimateGas[fnName]

    if (!method) {
      throw new HttpException('Invalid method name: ' + fnName, HttpStatus.BAD_REQUEST)
    }

    return method(...params, {
      from,
      value,
    })
  }

  async getErc20TransferGasFee(getGasDto: GetGasDto): Promise<number> {
    const { senderAddress, recipientAddress, amount, asset, txType } = getGasDto

    const gasFee = await this.estimateCallGasLimit({
      abi: erc20ABI,
      contractAddress: asset.contractAddress,
      fnName: txType,
      from: senderAddress,
      params: [recipientAddress, amount.toString()],
    })

    return gasFee.toNumber()
  }

  async getNativeGasFee(getGasDto: GetGasDto): Promise<number> {
    const { senderAddress, recipientAddress, amount, memo } = getGasDto
    const txAmount = BigNumber.from(amount)

    const gasInBigNumber = await this.infuraProvider.estimateGas({
      from: senderAddress,
      to: recipientAddress,
      value: txAmount,
      data: memo ? toUtf8Bytes(memo) : undefined,
    })

    return gasInBigNumber.toNumber()
  }
}
