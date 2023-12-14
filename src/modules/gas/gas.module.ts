import { Module } from '@nestjs/common'
import { EthereumGasService } from './services/ethereum.gas.service'
import { GasController } from './gas.controller'
import { BitcoinGasService } from './services/bitcoin.gas.service'

@Module({
  imports: [],
  providers: [EthereumGasService, BitcoinGasService],
  exports: [],
  controllers: [GasController],
})
export class GasModule {}
