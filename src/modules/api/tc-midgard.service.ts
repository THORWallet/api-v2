import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'

@Injectable()
export class TcMidgardHttpConfigService implements HttpModuleOptionsFactory {
  createHttpOptions(): HttpModuleOptions {
    return {
      timeout: parseInt(process.env.HTTP_TIMEOUT),
      maxRedirects: parseInt(process.env.HTTP_MAX_REDIRECTS),
      baseURL: process.env.PUBLIC_TC_MIDGARD_URL,
    }
  }
}
