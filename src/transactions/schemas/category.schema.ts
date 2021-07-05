import * as mongoose from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema()
export class Category {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: string

  @Prop({ required: true })
  name: string

  @Prop()
  color: string
}

export const CategorySchema = SchemaFactory.createForClass(Category).set(
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
