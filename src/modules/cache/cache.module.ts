import { CacheModule } from '@nestjs/cache-manager'
import { RedisClientOptions } from 'redis'
import { redisStore } from 'cache-manager-redis-yet'
import { Module } from '@nestjs/common'
import * as dotenv from 'dotenv'
dotenv.config()

@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      isGlobal: true,
      socket: {
        host: process.env.MODE === 'local' ? 'localhost' : process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
  ],
})
export class Cache {}
