import { Module } from '@nestjs/common'
import { TransactionsService } from './transactions.service'
import { TransactionsController } from './transactions.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { TransactionSchema } from './schemas/transaction.schema'
import { CategorySchema } from './schemas/category.schema'
import { UsersModule } from '../users/users.module'
import { AuthModule } from '../auth/auth.module'
import { CurrencySchema } from '../currencies/schemas/currency.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Category', schema: CategorySchema },
      { name: 'Currency', schema: CurrencySchema },
      { name: 'Transaction', schema: TransactionSchema },
    ]),
    UsersModule,
    AuthModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
