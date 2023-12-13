export const POOL_KEYS = {
  tcMidgardPool: 'tc-midgard-pools',
  mayaMidgardPool: 'maya-midgard-pools',
  tcPoolHistory: (pool: string, count: number) => `tc-pool-history-${pool}-${count}`,
  mayaPoolHistory: (pool: string, count: number) => `maya-pool-history-${pool}-${count}`,
}
