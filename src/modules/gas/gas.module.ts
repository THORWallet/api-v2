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
import { AvaxGasService } from './services/avax.gas.service'
import { BscGasService } from './services/bsc.gas.service'
import { ThorchainGasService } from './services/thorchain.gas.service'
import { StatsService } from '../stats/stats.service'
import { MayaGasService } from './services/maya.gas.service'
import { BnbGasService } from './services/bnb.gas.service'
import { AtomGasService } from './services/atom.gas.service'

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
    AvaxGasService,
    BscGasService,
    ThorchainGasService,
    StatsService,
    MayaGasService,
    BnbGasService,
    AtomGasService,
  ],
  exports: [],
  controllers: [GasController],
})
export class GasModule {}
