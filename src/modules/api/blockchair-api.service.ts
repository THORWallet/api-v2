import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'

@Injectable()
export class BlockchairHttpConfigService implements HttpModuleOptionsFactory {
  createHttpOptions(): HttpModuleOptions {
    return {
      timeout: parseInt(process.env.HTTP_TIMEOUT),
      maxRedirects: parseInt(process.env.HTTP_MAX_REDIRECTS),
      baseURL: process.env.BLOCKCHAIR_URL,
      params: {
        key: process.env.BLOCKCHAIR_KEY,
      },
    }
  }
}
