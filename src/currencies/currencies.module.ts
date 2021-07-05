import { Module } from '@nestjs/common'
import { CurrenciesService } from './currencies.service'
import { CurrenciesController } from './currencies.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { CurrencySchema } from './schemas/currency.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Currency', schema: CurrencySchema }]),
  ],
  controllers: [CurrenciesController],
  providers: [CurrenciesService],
})
export class CurrenciesModule {}
