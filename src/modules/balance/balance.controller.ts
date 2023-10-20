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

    await this.cacheManager.set(BALANCE_KEYS.ethCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('eth/cached/:address')
  @ApiOperation({
    summary: 'Get cached eth balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: [Balance] })
  async ethCachedBalance(@Param('address') address: string): Promise<Balance[]> {
    const cachedBalances = await this.cacheManager.get<Balance[]>(BALANCE_KEYS.ethCache(address))
    if (cachedBalances) {
      return cachedBalances
    }
    const balances = this.balanceService.getBalancesForEthAddress(address)
    await this.cacheManager.set(BALANCE_KEYS.ethCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('btc/:address')
  @ApiOperation({
    summary: 'Get btc balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: [Balance] })
  async btcBalance(@Param('address') address: string): Promise<Balance> {
    const balances = await this.balanceService.getBtcBalanceForAddress(address)

    await this.cacheManager.set(BALANCE_KEYS.btcCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('btc/cached/:address')
  @ApiOperation({
    summary: 'Get cached btc balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: [Balance] })
  async btcCachedBalance(@Param('address') address: string): Promise<Balance> {
    const cachedBalances = await this.cacheManager.get<Balance>(BALANCE_KEYS.btcCache(address))
    if (cachedBalances) {
      return cachedBalances
    }
    const balances = await this.balanceService.getBtcBalanceForAddress(address)
    await this.cacheManager.set(BALANCE_KEYS.btcCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('bch/:address')
  @ApiOperation({
    summary: 'Get bch balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: [Balance] })
  async bchBalance(@Param('address') address: string): Promise<Balance> {
    const balances = await this.balanceService.getBchBalanceForAddress(address)

    await this.cacheManager.set(BALANCE_KEYS.bchCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('bch/cached/:address')
  @ApiOperation({
    summary: 'Get cached bch balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: [Balance] })
  async bchCachedBalance(@Param('address') address: string): Promise<Balance> {
    const cachedBalances = await this.cacheManager.get<Balance>(BALANCE_KEYS.bchCache(address))
    if (cachedBalances) {
      return cachedBalances
    }
    const balances = await this.balanceService.getBchBalanceForAddress(address)
    await this.cacheManager.set(BALANCE_KEYS.bchCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('ltc/:address')
  @ApiOperation({
    summary: 'Get ltc balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: [Balance] })
  async ltcBalance(@Param('address') address: string): Promise<Balance> {
    const balances = await this.balanceService.getLtcBalanceForAddress(address)

    await this.cacheManager.set(BALANCE_KEYS.ltcCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('ltc/cached/:address')
  @ApiOperation({
    summary: 'Get cached ltc balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: [Balance] })
  async ltcCachedBalance(@Param('address') address: string): Promise<Balance> {
    const cachedBalances = await this.cacheManager.get<Balance>(BALANCE_KEYS.ltcCache(address))
    if (cachedBalances) {
      return cachedBalances
    }
    const balances = await this.balanceService.getLtcBalanceForAddress(address)
    await this.cacheManager.set(BALANCE_KEYS.ltcCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('doge/:address')
  @ApiOperation({
    summary: 'Get doge balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: [Balance] })
  async dogeBalance(@Param('address') address: string): Promise<Balance> {
    const balances = await this.balanceService.getDogeBalanceForAddress(address)

    await this.cacheManager.set(BALANCE_KEYS.dogeCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('doge/cached/:address')
  @ApiOperation({
    summary: 'Get cached doge balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: [Balance] })
  async dogeCachedBalance(@Param('address') address: string): Promise<Balance> {
    const cachedBalances = await this.cacheManager.get<Balance>(BALANCE_KEYS.dogeCache(address))
    if (cachedBalances) {
      return cachedBalances
    }
    const balances = await this.balanceService.getDogeBalanceForAddress(address)
    await this.cacheManager.set(BALANCE_KEYS.dogeCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('dash/:address')
  @ApiOperation({
    summary: 'Get dash balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: [Balance] })
  async dashBalance(@Param('address') address: string): Promise<Balance> {
    const balances = await this.balanceService.getDashBalanceForAddress(address)

    await this.cacheManager.set(BALANCE_KEYS.dashCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('dash/cached/:address')
  @ApiOperation({
    summary: 'Get cached dash balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: [Balance] })
  async dashCachedBalance(@Param('address') address: string): Promise<Balance> {
    const cachedBalances = await this.cacheManager.get<Balance>(BALANCE_KEYS.dashCache(address))
    if (cachedBalances) {
      return cachedBalances
    }
    const balances = await this.balanceService.getDashBalanceForAddress(address)
    await this.cacheManager.set(BALANCE_KEYS.dashCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('thorchain/:address')
  @ApiOperation({
    summary: 'Get thorchain balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: [Balance] })
  async thorchainBalance(@Param('address') address: string): Promise<Balance> {
    const balances = await this.balanceService.getThorchainBalanceForAddress(address)

    await this.cacheManager.set(BALANCE_KEYS.thorchainCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('thorchain/cached/:address')
  @ApiOperation({
    summary: 'Get cached thorchain balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: [Balance] })
  async thorchainCachedBalance(@Param('address') address: string): Promise<Balance> {
    const cachedBalances = await this.cacheManager.get<Balance>(BALANCE_KEYS.thorchainCache(address))
    if (cachedBalances) {
      return cachedBalances
    }
    const balances = await this.balanceService.getThorchainBalanceForAddress(address)
    await this.cacheManager.set(BALANCE_KEYS.thorchainCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('bnb/:address')
  @ApiOperation({
    summary: 'Get bnb balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: [Balance] })
  async bnbBalance(@Param('address') address: string): Promise<Balance[]> {
    const balances = await this.balanceService.getBnbBalanceForAddress(address)

    await this.cacheManager.set(BALANCE_KEYS.bnbCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('bnb/cached/:address')
  @ApiOperation({
    summary: 'Get cached bnb balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: [Balance] })
  async bnbCachedBalance(@Param('address') address: string): Promise<Balance[]> {
    const cachedBalances = await this.cacheManager.get<Balance[]>(BALANCE_KEYS.bnbCache(address))
    if (cachedBalances) {
      return cachedBalances
    }
    const balances = await this.balanceService.getBnbBalanceForAddress(address)
    await this.cacheManager.set(BALANCE_KEYS.bnbCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('bsc/:address')
  @ApiOperation({
    summary: 'Get bsc balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: [Balance] })
  async bscBalance(@Param('address') address: string): Promise<Balance[]> {
    const balances = await this.balanceService.getBscBalanceForAddress(address)

    await this.cacheManager.set(BALANCE_KEYS.bscCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('bsc/cached/:address')
  @ApiOperation({
    summary: 'Get cached bsc balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: [Balance] })
  async bscCachedBalance(@Param('address') address: string): Promise<Balance[]> {
    const cachedBalances = await this.cacheManager.get<Balance[]>(BALANCE_KEYS.bscCache(address))
    if (cachedBalances) {
      return cachedBalances
    }
    const balances = await this.balanceService.getBscBalanceForAddress(address)
    await this.cacheManager.set(BALANCE_KEYS.bscCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('avalance/:address')
  @ApiOperation({
    summary: 'Get avalanche balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: [Balance] })
  async avalancheBalance(@Param('address') address: string): Promise<Balance[]> {
    const balances = await this.balanceService.getAvalancheBalanceForAddress(address)

    await this.cacheManager.set(BALANCE_KEYS.avalancheCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('avalanche/cached/:address')
  @ApiOperation({
    summary: 'Get cached avalanche balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: [Balance] })
  async avalancheCachedBalance(@Param('address') address: string): Promise<Balance[]> {
    const cachedBalances = await this.cacheManager.get<Balance[]>(BALANCE_KEYS.avalancheCache(address))
    if (cachedBalances) {
      return cachedBalances
    }
    const balances = await this.balanceService.getAvalancheBalanceForAddress(address)
    await this.cacheManager.set(BALANCE_KEYS.avalancheCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }
}
