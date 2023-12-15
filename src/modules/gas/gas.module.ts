import { Module } from '@nestjs/common'
import { EthereumGasService } from './services/ethereum.gas.service'
import { GasController } from './gas.controller'
import { BitcoinGasService } from './services/bitcoin.gas.service'
import { GasService } from './services/gas.service'
import { UtxoService } from './services/utxo.service'

@Module({
  imports: [],
  providers: [EthereumGasService, BitcoinGasService, GasService, UtxoService],
  exports: [],
  controllers: [GasController],
})
export class GasModule {}
