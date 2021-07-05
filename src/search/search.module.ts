import { Module } from '@nestjs/common'
import { SearchService } from './search.service'
import { SearchController } from './search.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { CategorySchema } from '../transactions/schemas/category.schema'
import { TransactionSchema } from '../transactions/schemas/transaction.schema'
import { UsersModule } from '../users/users.module'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Category', schema: CategorySchema },
      { name: 'Transaction', schema: TransactionSchema },
    ]),
    UsersModule,
    AuthModule,
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
