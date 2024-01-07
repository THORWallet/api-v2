import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Controller, Get, Inject, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Cache } from 'cache-manager'
import { GetSwapQuoteDto, SwapQuoteResponse } from './entitites/quote.dto'
import { QuoteService } from './quote.service'

@Controller('quote')
@ApiTags('Quotes')
export class QuoteController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly quoteService: QuoteService,
  ) {}

  @Get('swap')
  @ApiOperation({
    summary: 'Get a swap quote for a given assets pair',
  })
  @ApiResponse({ status: 200, description: 'Success', type: SwapQuoteResponse })
  async getSwapQuote(@Query() query: GetSwapQuoteDto): Promise<SwapQuoteResponse> {
    return this.quoteService.getSwapQuotes(query)
  }
}
