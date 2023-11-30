import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Controller, Get, Inject, Param } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { PriceService } from './price.service'
import { PriceHistoryResponse } from './types'
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

    const history = await this.priceService.fetchPriceHistoryFromCoinGecko({ ticker })

    this.cacheManager.set(PRICE_CACHE.coingeckoHistory(ticker, 7), history, CACHE_TIME.hour * 24)

    return history
  }
}
