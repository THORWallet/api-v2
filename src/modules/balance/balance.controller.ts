import { Controller, Get, Inject, Param } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Balance, BalanceResponse } from './types/balance'
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
  @ApiResponse({ status: 200, description: 'Success', type: BalanceResponse })
  async ethBalance(@Param('address') address: string): Promise<BalanceResponse> {
    const balances = await this.balanceService.getBalancesForEthAddress(address)

    await this.cacheManager.set(BALANCE_KEYS.ethCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('eth/cached/:address')
  @ApiOperation({
    summary: 'Get cached eth balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: BalanceResponse })
  async ethCachedBalance(@Param('address') address: string): Promise<BalanceResponse> {
    const cachedBalances = await this.cacheManager.get<BalanceResponse>(BALANCE_KEYS.ethCache(address))
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
  @ApiResponse({ status: 200, description: 'Success', type: BalanceResponse })
  async btcBalance(@Param('address') address: string): Promise<BalanceResponse> {
    const balances = await this.balanceService.getBtcBalanceForAddress(address)

    await this.cacheManager.set(BALANCE_KEYS.btcCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('btc/cached/:address')
  @ApiOperation({
    summary: 'Get cached btc balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: BalanceResponse })
  async btcCachedBalance(@Param('address') address: string): Promise<BalanceResponse> {
    const cachedBalances = await this.cacheManager.get<BalanceResponse>(BALANCE_KEYS.btcCache(address))
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
  @ApiResponse({ status: 200, description: 'Success', type: BalanceResponse })
  async bchBalance(@Param('address') address: string): Promise<BalanceResponse> {
    const balances = await this.balanceService.getBchBalanceForAddress(address)

    await this.cacheManager.set(BALANCE_KEYS.bchCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('bch/cached/:address')
  @ApiOperation({
    summary: 'Get cached bch balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: BalanceResponse })
  async bchCachedBalance(@Param('address') address: string): Promise<BalanceResponse> {
    const cachedBalances = await this.cacheManager.get<BalanceResponse>(BALANCE_KEYS.bchCache(address))
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
  @ApiResponse({ status: 200, description: 'Success', type: BalanceResponse })
  async ltcBalance(@Param('address') address: string): Promise<BalanceResponse> {
    const balances = await this.balanceService.getLtcBalanceForAddress(address)

    await this.cacheManager.set(BALANCE_KEYS.ltcCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('ltc/cached/:address')
  @ApiOperation({
    summary: 'Get cached ltc balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: BalanceResponse })
  async ltcCachedBalance(@Param('address') address: string): Promise<BalanceResponse> {
    const cachedBalances = await this.cacheManager.get<BalanceResponse>(BALANCE_KEYS.ltcCache(address))
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
  @ApiResponse({ status: 200, description: 'Success', type: BalanceResponse })
  async dogeBalance(@Param('address') address: string): Promise<BalanceResponse> {
    const balances = await this.balanceService.getDogeBalanceForAddress(address)

    await this.cacheManager.set(BALANCE_KEYS.dogeCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('doge/cached/:address')
  @ApiOperation({
    summary: 'Get cached doge balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: BalanceResponse })
  async dogeCachedBalance(@Param('address') address: string): Promise<BalanceResponse> {
    const cachedBalances = await this.cacheManager.get<BalanceResponse>(BALANCE_KEYS.dogeCache(address))
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
  @ApiResponse({ status: 200, description: 'Success', type: BalanceResponse })
  async dashBalance(@Param('address') address: string): Promise<BalanceResponse> {
    const balances = await this.balanceService.getDashBalanceForAddress(address)

    await this.cacheManager.set(BALANCE_KEYS.dashCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('dash/cached/:address')
  @ApiOperation({
    summary: 'Get cached dash balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: BalanceResponse })
  async dashCachedBalance(@Param('address') address: string): Promise<BalanceResponse> {
    const cachedBalances = await this.cacheManager.get<BalanceResponse>(BALANCE_KEYS.dashCache(address))
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
  @ApiResponse({ status: 200, description: 'Success', type: BalanceResponse })
  async thorchainBalance(@Param('address') address: string): Promise<BalanceResponse> {
    const balances = await this.balanceService.getThorchainBalanceForAddress(address)

    await this.cacheManager.set(BALANCE_KEYS.thorchainCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('thorchain/cached/:address')
  @ApiOperation({
    summary: 'Get cached thorchain balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: BalanceResponse })
  async thorchainCachedBalance(@Param('address') address: string): Promise<BalanceResponse> {
    const cachedBalances = await this.cacheManager.get<BalanceResponse>(BALANCE_KEYS.thorchainCache(address))
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
  @ApiResponse({ status: 200, description: 'Success', type: BalanceResponse })
  async bnbBalance(@Param('address') address: string): Promise<BalanceResponse> {
    const balances = await this.balanceService.getBnbBalanceForAddress(address)

    await this.cacheManager.set(BALANCE_KEYS.bnbCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('bnb/cached/:address')
  @ApiOperation({
    summary: 'Get cached bnb balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: BalanceResponse })
  async bnbCachedBalance(@Param('address') address: string): Promise<BalanceResponse> {
    const cachedBalances = await this.cacheManager.get<BalanceResponse>(BALANCE_KEYS.bnbCache(address))
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
  @ApiResponse({ status: 200, description: 'Success', type: BalanceResponse })
  async bscBalance(@Param('address') address: string): Promise<BalanceResponse> {
    const balances = await this.balanceService.getBscBalanceForAddress(address)

    await this.cacheManager.set(BALANCE_KEYS.bscCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('bsc/cached/:address')
  @ApiOperation({
    summary: 'Get cached bsc balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: BalanceResponse })
  async bscCachedBalance(@Param('address') address: string): Promise<BalanceResponse> {
    const cachedBalances = await this.cacheManager.get<BalanceResponse>(BALANCE_KEYS.bscCache(address))
    if (cachedBalances) {
      return cachedBalances
    }
    const balances = await this.balanceService.getBscBalanceForAddress(address)
    await this.cacheManager.set(BALANCE_KEYS.bscCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('avalanche/:address')
  @ApiOperation({
    summary: 'Get avalanche balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: BalanceResponse })
  async avalancheBalance(@Param('address') address: string): Promise<BalanceResponse> {
    const balances = await this.balanceService.getAvalancheBalanceForAddress(address)

    await this.cacheManager.set(BALANCE_KEYS.avalancheCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('avalanche/cached/:address')
  @ApiOperation({
    summary: 'Get cached avalanche balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: BalanceResponse })
  async avalancheCachedBalance(@Param('address') address: string): Promise<BalanceResponse> {
    const cachedBalances = await this.cacheManager.get<BalanceResponse>(BALANCE_KEYS.avalancheCache(address))
    if (cachedBalances) {
      return cachedBalances
    }
    const balances = await this.balanceService.getAvalancheBalanceForAddress(address)
    await this.cacheManager.set(BALANCE_KEYS.avalancheCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('cosmos/:address')
  @ApiOperation({
    summary: 'Get cosmos balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: BalanceResponse })
  async cosmosBalance(@Param('address') address: string): Promise<BalanceResponse> {
    const balances = await this.balanceService.getCosmosBalanceForAddress(address)

    await this.cacheManager.set(BALANCE_KEYS.cosmosCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('cosmos/cached/:address')
  @ApiOperation({
    summary: 'Get cached cosmos balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: BalanceResponse })
  async cosmosCachedBalance(@Param('address') address: string): Promise<BalanceResponse> {
    const cachedBalances = await this.cacheManager.get<BalanceResponse>(BALANCE_KEYS.cosmosCache(address))
    if (cachedBalances) {
      return cachedBalances
    }
    const balances = await this.balanceService.getCosmosBalanceForAddress(address)
    await this.cacheManager.set(BALANCE_KEYS.cosmosCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('maya/:address')
  @ApiOperation({
    summary: 'Get maya balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: BalanceResponse })
  async mayaBalance(@Param('address') address: string): Promise<BalanceResponse> {
    const balances = await this.balanceService.getMayaBalanceForAddress(address)

    await this.cacheManager.set(BALANCE_KEYS.mayaCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('maya/cached/:address')
  @ApiOperation({
    summary: 'Get cached maya balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: BalanceResponse })
  async mayaCachedBalance(@Param('address') address: string): Promise<BalanceResponse> {
    const cachedBalances = await this.cacheManager.get<BalanceResponse>(BALANCE_KEYS.mayaCache(address))
    if (cachedBalances) {
      return cachedBalances
    }
    const balances = await this.balanceService.getMayaBalanceForAddress(address)
    await this.cacheManager.set(BALANCE_KEYS.mayaCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('kujira/:address')
  @ApiOperation({
    summary: 'Get kujira balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: BalanceResponse })
  async kujiraBalance(@Param('address') address: string): Promise<BalanceResponse> {
    const balances = await this.balanceService.getKujiraBalanceForAddress(address)

    await this.cacheManager.set(BALANCE_KEYS.kujiraCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }

  @Get('kujira/cached/:address')
  @ApiOperation({
    summary: 'Get cached kujira balances',
  })
  @ApiResponse({ status: 200, description: 'Success', type: BalanceResponse })
  async kujiraCachedBalance(@Param('address') address: string): Promise<BalanceResponse> {
    const cachedBalances = await this.cacheManager.get<BalanceResponse>(BALANCE_KEYS.kujiraCache(address))
    if (cachedBalances) {
      return cachedBalances
    }
    const balances = await this.balanceService.getKujiraBalanceForAddress(address)
    await this.cacheManager.set(BALANCE_KEYS.kujiraCache(address), balances, CACHE_TIME.hour * 24)
    return balances
  }
}
