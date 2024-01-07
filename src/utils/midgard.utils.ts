import BigNumber from 'bignumber.js'
import { CACAO_DECIMAL, MIDGARD_DECIMAL } from '../constants'

export const formatMidgardNumber = (value: string, isMaya?: boolean): BigNumber =>
  new BigNumber(value).div(10 ** (isMaya ? CACAO_DECIMAL : MIDGARD_DECIMAL))
