import { Category } from '../interfaces/category.interface'
import { TransactionType } from '../enums/transaction-type.enum'

export class UpdateTransactionDto {
  transactionType: TransactionType
  category: Category
  place: string
  price: number
  currency: string
  created: Date
  description: string
}
