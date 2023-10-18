import { Controller, Get, Inject, Param } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Balance } from './types/balance'
import { BalanceService } from './balance.service'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { BALANCE_KEYS } from './cache-keys/balance.cache-keys'
import { CACHE_TIME } from '../../constants'

@Controller('balance')
@ApiTags('Balances')
export class BalanceController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly balanceService: BalanceService,
  ) {}

  @Get('eth/:address')
  @ApiOperation({
    summary: 'Get eth balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: [Balance] })
  async ethBalance(@Param('address') address: string): Promise<Balance[]> {
    const balances = await this.balanceService.getBalancesForEthAddress(address)

    await this.cacheManager.set(BALANCE_KEYS.ethCache, balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('eth/cached/:address')
  @ApiOperation({
    summary: 'Get cached eth balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: [Balance] })
  async ethCachedBalance(@Param('address') address: string): Promise<Balance[]> {
    const cachedBalances = await this.cacheManager.get<Balance[]>(BALANCE_KEYS.ethCache)
    if (cachedBalances) {
      return cachedBalances
    }
    return this.balanceService.getBalancesForEthAddress(address)
  }
}
