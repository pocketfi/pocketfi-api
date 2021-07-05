import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Currency } from './interfaces/currency.interface'

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectModel('Currency')
    private readonly categoryModel: Model<Currency>,
  ) {}

  findAll() {
    return `This action returns all transactions`
  }
}
