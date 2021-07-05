import * as mongoose from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { TransactionType } from '../enums/transaction-type.enum'
import { User } from '../../users/schemas/user.schema'
import { Category } from '../interfaces/category.interface'

@Schema()
export class Transaction {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: User

  @Prop({
    type: String,
    required: true,
  })
  transactionType: TransactionType

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  })
  category: Category

  @Prop({
    type: String,
  })
  place: string

  @Prop({
    type: Number,
    required: true,
  })
  price: number

  @Prop({
    type: String,
    required: true,
  })
  currency: string

  @Prop({
    type: String,
  })
  description: string

  @Prop({
    type: Date,
    default: Date.now,
  })
  created: Date
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction).set(
  'toJSON',
  {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      ret.id = ret._id
      delete ret._id
    },
  },
)
