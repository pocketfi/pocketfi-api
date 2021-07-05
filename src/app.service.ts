import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { exchangeRates } from 'exchange-rates-api'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Currency } from './currencies/interfaces/currency.interface'

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @InjectModel('Currency')
    private readonly currencyModel: Model<Currency>,
  ) {}

  async getRates(): Promise<void> {
    // Get the latest exchange rates
    const currencyRates = await exchangeRates()
      .setApiBaseUrl('https://api.exchangerate.host')
      .latest()
      .fetch()

    Object.keys(currencyRates).forEach((key) =>
      this.currencyModel.create({ code: key.toString() }),
    )
  }

  async onModuleInit() {
    await this.getRates()
  }

  async onModuleDestroy() {
    await this.currencyModel.deleteMany({})
  }
}
