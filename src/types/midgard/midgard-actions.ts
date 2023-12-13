export type MidgardCoin = {
  asset: string
  amount: string
}

export type MidgardTx = {
  txID: string
  address: string
  coins: MidgardCoin[]
}

export type MidgardAction = {
  height: string
  date: string
  pools: string[]
  in: MidgardTx[]
  out: MidgardTx[]
  status: 'success' | 'pending'
} & OptionalData

export type OptionalData =
  | {
      type: 'swap'
      metadata: {
        swap: Swap
      }
    }
  | {
      type: 'addLiquidity'
      metadata: {
        addLiquidity?: AddLiquidity
      }
    }
  | {
      type: 'withdraw'
      metadata: {
        withdraw: Withdraw
      }
    }
  | {
      type: 'saversWithdraw'
      metadata: {
        withdraw?: Withdraw
        swap?: Swap
      }
    }
  | {
      type: 'donate'
    }
  | {
      type: 'refund'
      metadata: {
        refund: Refund
      }
    }
  | {
      type: 'switch'
    }

type NetworkFee = {
  asset: string
  amount: string
}

type Refund = {
  networkFees: NetworkFee[]
  reason: string
}

type Withdraw = {
  liquidityUnits: string
  asymmetry: string
  basisPoints: string
  networkFees: NetworkFee[]
  impermanentLossProtection: string
}

type AddLiquidity = {
  liquidityUnits: string
}

type Swap = {
  networkFees: NetworkFee[]
  liquidityFee: string
  swapSlip: string
  swapTarget: string
  memo?: string
}

export type MidgardActionResponse = {
  count: string
  actions: MidgardAction[]
}
