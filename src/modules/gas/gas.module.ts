import { Module } from '@nestjs/common'
import { EthereumGasService } from './services/ethereum.gas.service'
import { GasController } from './gas.controller'

@Module({
  imports: [],
  providers: [EthereumGasService],
  exports: [],
  controllers: [GasController],
})
export class GasModule {}
