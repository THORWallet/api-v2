import { Module } from '@nestjs/common'
import { EthereumGasService } from './services/ethereum.gas.service'
import { GasController } from './gas.controller'
import { BitcoinGasService } from './services/bitcoin.gas.service'
import { GasService } from './services/gas.service'
import { UtxoService } from './services/utxo.service'
import { BitcoinCashGasService } from './services/bitcoin-cash.service'
import { DogeGasService } from './services/doge.gas.service'
import { LitecoinGasService } from './services/litecoin.gas.service'
import { DashGasService } from './services/dash.gas.service'

@Module({
  imports: [],
  providers: [
    EthereumGasService,
    BitcoinGasService,
    GasService,
    UtxoService,
    BitcoinCashGasService,
    DogeGasService,
    LitecoinGasService,
    DashGasService,
  ],
  exports: [],
  controllers: [GasController],
})
export class GasModule {}
