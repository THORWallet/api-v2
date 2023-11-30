export const PRICE_CACHE = {
  coingeckoAssets: (assets) => `coingecko-assets-${assets}`,
  coingeckoHistory: (ticker, days) => `coingecko-history-${ticker}-${days}`,
}
