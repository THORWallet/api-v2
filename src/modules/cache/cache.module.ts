import { CacheModule } from '@nestjs/cache-manager'
import { RedisClientOptions } from 'redis'
import { redisStore } from 'cache-manager-redis-yet'
import { Module } from '@nestjs/common'

@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      isGlobal: true,
      socket: {
        host: 'localhost',
        port: parseInt('6379'),
      },
    }),
  ],
})
export class Cache {}
