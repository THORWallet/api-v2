import { CacheModule } from '@nestjs/cache-manager'
import { redisStore } from 'cache-manager-redis-yet'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('MODE') === 'local' ? 'localhost' : configService.get('REDIS_HOST'),
        port: parseInt(configService.get<string>('REDIS_PORT')),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class Cache {}
