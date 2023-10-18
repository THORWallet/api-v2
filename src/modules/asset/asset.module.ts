import { Module } from '@nestjs/common'
import { AssetController } from './asset.controller'
import { AssetService } from './asset.service'
import { PoolAsset } from './entities/pool-asset.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([PoolAsset])],
  controllers: [AssetController],
  providers: [AssetService],
  exports: [TypeOrmModule.forFeature([PoolAsset]), AssetService],
})
export class AssetModule {}
