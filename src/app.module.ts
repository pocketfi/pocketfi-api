import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { TransactionsModule } from './transactions/transactions.module'
import { CurrencySchema } from './currencies/schemas/currency.schema'
import { SearchModule } from './search/search.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(`${process.env.DATABASE_CONNECION}`, {
      useCreateIndex: true,
      useFindAndModify: false,
    }),
    MongooseModule.forFeature([{ name: 'Currency', schema: CurrencySchema }]),
    AuthModule,
    UsersModule,
    TransactionsModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
