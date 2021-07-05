import { Document } from 'mongoose'
import { Category } from './category.interface'

export interface Transaction extends Document {
  id?: string
  user: string
  transactionType: string
  category: Category
  place: string
  price: number
  currency: string
  created?: Date
  description?: string
}
