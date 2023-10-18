import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'

@Injectable()
export class EthplorerHttpConfigService implements HttpModuleOptionsFactory {
  createHttpOptions(): HttpModuleOptions {
    return {
      timeout: parseInt(process.env.HTTP_TIMEOUT),
      maxRedirects: parseInt(process.env.HTTP_MAX_REDIRECTS),
      baseURL: process.env.ETHPLORER_API,
      params: {
        apiKey: process.env.ETHPLORER_API_KEY,
      },
    }
  }
}
