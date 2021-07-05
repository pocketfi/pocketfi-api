import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Transaction } from './interfaces/transaction.interface'
import { Category } from './interfaces/category.interface'
import { CategoryColor } from './enums/category-color.enum'
import { Currency } from '../currencies/interfaces/currency.interface'
import { TransactionType } from './enums/transaction-type.enum'
import { User } from '../users/interfaces/user.interface'

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel('Transaction')
    private readonly transactionModel: Model<Transaction>,
    @InjectModel('Category')
    private readonly categoryModel: Model<Category>,
    @InjectModel('Currency')
    private readonly currencyModel: Model<Currency>,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
    user: User,
  ): Promise<Transaction> {
    let category = await this.categoryModel.findOne({
      name: createTransactionDto.category
        ? createTransactionDto.category
        : 'Other',
      user: user.id,
    })

    if (!category) {
      category = await this.categoryModel.create({
        name: createTransactionDto.category
          ? createTransactionDto.category
          : 'Other',
        user: user.id,
        color: this.#generateRandomColor(),
      })
    }

    const currency = await this.currencyModel.findOne({
      code: createTransactionDto.currency,
    })

    if (!currency) {
      throw new BadRequestException('Such currency does not exist')
    }

    const transactionType =
      TransactionType[createTransactionDto.transactionType]

    if (!transactionType) {
      throw new BadRequestException('Such transaction type does not exist')
    }

    return await this.transactionModel.create({
      user: user.id,
      transactionType: transactionType,
      category: category,
      place: createTransactionDto.place,
      price: createTransactionDto.price,
      currency: createTransactionDto.currency,
    })
  }

  async findAll(user: User): Promise<Transaction[]> {
    return this.transactionModel
      .find({ user: user.id })
      .sort({ created: 1 })
      .populate('category')
  }

  async findOne(id: string, user: User) {
    const transaction = await this.transactionModel
      .findById(id)
      .populate('category')
    if (transaction.user !== user.id) {
      throw new ForbiddenException('This user cannot get a current transaction')
    }
    return transaction
  }

  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
    user: User,
  ): Promise<Transaction> {
    let category: Category
    if (updateTransactionDto.category) {
      category = await this.categoryModel.findOneAndUpdate(
        {
          name: updateTransactionDto.category.name,
          user: user.id,
        },
        {
          name: updateTransactionDto.category.name,
          color: updateTransactionDto.category.color
            ? updateTransactionDto.category.color
            : this.#generateRandomColor(),
        },
      )

      if (!category) {
        category = await this.categoryModel.create({
          name: updateTransactionDto.category.name
            ? updateTransactionDto.category.name
            : 'Other',
          color: updateTransactionDto.category.color
            ? updateTransactionDto.category.color
            : this.#generateRandomColor(),
          user: user,
        })
      }
    }

    if (!updateTransactionDto.category) {
      category = await this.categoryModel.findOne({
        name: updateTransactionDto.category.name,
        user: user.id,
      })
    }

    return this.transactionModel
      .findByIdAndUpdate(
        id,
        {
          transactionType: updateTransactionDto.transactionType,
          category,
          place: updateTransactionDto.place,
          price: updateTransactionDto.price,
          currency: updateTransactionDto.currency,
          created: updateTransactionDto.created,
          description: updateTransactionDto.description,
        },
        { new: true },
      )
      .populate('category')
  }

  async remove(id: string, user: User): Promise<void> {
    const transaction = await this.transactionModel.findById(id)
    if (!transaction) {
      throw new NotFoundException('Transaction not found')
    }
    if (transaction.user != user.id) {
      throw new ForbiddenException('No permissions to delete this transaction')
    }
    await this.transactionModel.findByIdAndDelete(transaction.id)
  }

  #generateRandomColor = () => {
    const enumValues = Object.keys(CategoryColor)
    const randomIndex = Math.floor(Math.random() * enumValues.length)
    return enumValues[randomIndex]
  }
}
