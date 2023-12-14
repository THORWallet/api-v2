import { Injectable } from '@nestjs/common'

@Injectable()
export class BitcoinGasService {
  async getGasFee(args: any): Promise<any> {}
}
