import { SupportedChainIds } from '../../commands/assets/helpers/helpers'

export type EvmChainId = (typeof SupportedChainIds)[keyof typeof SupportedChainIds]
