import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Controller, Get, Inject, Param } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { PriceService } from './price.service'
import { PriceHistoryResponse, PriceUSDResponse } from './types'
import { Cache } from 'cache-manager'
import { PRICE_CACHE } from './cache-keys/price.cache-keys'
import { CACHE_TIME } from '../../constants'

@Controller('price')
@ApiTags('Price')
export class PriceController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly priceService: PriceService,
  ) {}

  @Get('history/:ticker')
  @ApiOperation({
    summary: 'Get price history for a given ticker',
  })
  @ApiResponse({ status: 200, description: 'Success', type: PriceHistoryResponse })
  async getPriceHistory(@Param('ticker') ticker: string): Promise<PriceHistoryResponse> {
    const cachedData = await this.cacheManager.get<PriceHistoryResponse>(PRICE_CACHE.coingeckoHistory(ticker, 7))

    if (cachedData) {
      return cachedData
    }

    const history = await this.priceService.fetchPriceHistory({ ticker, days: 7 })

    this.cacheManager.set(PRICE_CACHE.coingeckoHistory(ticker, 7), history, CACHE_TIME.hour * 24)

    return history
  }

  @Get('/usd/:ticker')
  @ApiOperation({
    summary: 'Get price in usd for a given ticker',
  })
  @ApiResponse({ status: 200, description: 'Success', type: PriceUSDResponse })
  async getUsdPrice(@Param('ticker') ticker: string): Promise<Record<string, number>> {
    return this.priceService.fetchPricesFromCoingecko([ticker])
  }
}
