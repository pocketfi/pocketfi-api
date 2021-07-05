import { Document } from 'mongoose'

export interface Currency extends Document {
  code: string
}
