import { Injectable } from '@nestjs/common'
import { script, opcodes } from 'bitcoinjs-lib'
import { BaseAmount, baseAmount } from '@xchainjs/xchain-util'
import { UTXOChain } from '../../../constants'
import { BCH_MIN_TX_FEE, BTC_MIN_TX_FEE, DASH_MIN_TX_FEE, DOGE_MIN_TX_FEE, LTC_MIN_TX_FEE } from '../constans'
import { UTXO, UTXOs } from '../entities'

const TX_EMPTY_SIZE = 4 + 1 + 1 + 4 // 10
const TX_INPUT_BASE = 32 + 4 + 1 + 4 // 41
const TX_INPUT_PUBKEYHASH = 107
const TX_OUTPUT_BASE = 8 + 1 // 9
const TX_OUTPUT_PUBKEYHASH = 25

const UTXO_DECIMAL = 8

@Injectable()
export class UtxoService {
  compileMemo = (memo: string): Buffer => {
    const data = Buffer.from(memo, 'utf8') // converts MEMO to buffer
    return script.compile([opcodes.OP_RETURN as number, data]) // Compile OP_RETURN script
  }

  inputBytes = (input: UTXO): number => {
    return TX_INPUT_BASE + (input.witnessUtxo?.script ? input.witnessUtxo.script.length : TX_INPUT_PUBKEYHASH)
  }

  getUTXOFee = (inputs: UTXOs, feeRate: number, data: Buffer | null, minTxFee: number): number => {
    let sum =
      TX_EMPTY_SIZE +
      inputs.reduce((a, x) => a + this.inputBytes(x), 0) +
      inputs.length + // +1 byte for each input signature
      TX_INPUT_BASE +
      TX_INPUT_PUBKEYHASH +
      TX_OUTPUT_BASE +
      TX_OUTPUT_PUBKEYHASH

    if (data) {
      sum += TX_OUTPUT_BASE + data.length
    }

    const fee = sum * feeRate
    return Math.max(fee, minTxFee)
  }

  calcUtxoFee = (feeRate: number, memo: string | null, chain: UTXOChain): BaseAmount => {
    const minFees: { [key in UTXOChain]: number } = {
      BCH: BCH_MIN_TX_FEE,
      BTC: BTC_MIN_TX_FEE,
      DOGE: DOGE_MIN_TX_FEE,
      LTC: LTC_MIN_TX_FEE,
      DASH: DASH_MIN_TX_FEE,
    }
    const compiledMemo = memo ? this.compileMemo(memo) : null
    const fee = this.getUTXOFee([], feeRate, compiledMemo, minFees[chain])
    return baseAmount(fee, UTXO_DECIMAL)
  }
}
