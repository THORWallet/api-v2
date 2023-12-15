import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { GasFeeType, GasResponse, GetGasDto } from '../entities/gas.dto'
import { InfuraProvider } from '@ethersproject/providers'
import { ConfigService } from '@nestjs/config'
import { BigNumber } from '@ethersproject/bignumber'
import { toUtf8Bytes } from '@ethersproject/strings'
import { Contract } from '@ethersproject/contracts'
import { EstimateCallGasLimitArgs } from '../entities'
import { erc20ABI } from '../../../constants'
import { SupportedChainIds } from '../../../commands/assets/helpers/helpers'
import { Asset } from '../../asset/entities/pool-asset.entity'

@Injectable()
export class EthereumGasService {
  constructor(private configService: ConfigService) {
    this.infuraProvider = new InfuraProvider('homestead', {
      projectId: this.configService.get<string>('INFURA_PROJECT_ID'),
    })
  }

  private infuraProvider: InfuraProvider

  getChainId = (asset: Asset): number => {
    if (asset.chain === 'ETH') {
      return SupportedChainIds.Ethereum
    }

    throw new HttpException('Invalid chain', HttpStatus.BAD_REQUEST)
  }

  async getGasFee(getGasDto: GetGasDto): Promise<GasResponse> {
    const isErc20 = getGasDto.asset.contractAddress !== undefined
    const { txType, asset } = getGasDto
    const chainId = this.getChainId(getGasDto.asset)

    if (isErc20) {
      switch (txType) {
        case 'transfer': {
          const gasFee = await this.getErc20TransferGasFee(getGasDto)

          return {
            gasFees: { average: gasFee, fast: gasFee, fastest: gasFee },
            baseFee: gasFee,
            chainId,
            type: GasFeeType.ETH_FEES,
          }
        }
        //TODO: add deposit fee
        default:
          throw new HttpException('Invalid transaction type', HttpStatus.BAD_REQUEST)
      }
    }

    if (asset.chain !== 'ETH' && asset.ticker !== 'ETH') {
      throw new HttpException('Invalid asset', HttpStatus.BAD_REQUEST)
    }

    const gasFee = await this.getNativeGasFee(getGasDto)

    return {
      gasFees: { average: gasFee, fast: gasFee, fastest: gasFee },
      baseFee: gasFee,
      chainId,
      type: GasFeeType.ETH_FEES,
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
