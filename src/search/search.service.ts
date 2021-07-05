import { Injectable } from '@nestjs/common'
import { SearchTransactionDto } from './dto/search-transaction.dto'
import { User } from '../users/interfaces/user.interface'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Transaction } from '../transactions/interfaces/transaction.interface'
import { Category } from '../transactions/interfaces/category.interface'
import { SearchPlaceDto } from './dto/search-place.dto'
import { SearchCategoryDto } from './dto/search-category.dto'

@Injectable()
export class SearchService {
  constructor(
    @InjectModel('Transaction')
    private readonly transactionModel: Model<Transaction>,
    @InjectModel('Category')
    private readonly categoryModel: Model<Category>,
  ) {}

  async searchTransactions(
    searchTransactionDto: SearchTransactionDto,
    user: User,
  ): Promise<Transaction[]> {
    const category = await this.categoryModel.findOne({
      name: searchTransactionDto.category,
      user: user.id,
    })

    const transactions = await this.transactionModel
      .find({
        $and: [
          {
            $or: [
              {
                place: {
                  $regex: searchTransactionDto.searchText
                    ? searchTransactionDto.searchText
                    : '',
                  $options: 'i',
                },
              },
              {
                description: {
                  $regex: searchTransactionDto.searchText
                    ? searchTransactionDto.searchText
                    : '',
                  $options: 'i',
                },
              },
              {
                currency: {
                  $regex: searchTransactionDto.searchText
                    ? searchTransactionDto.searchText
                    : '',
                  $options: 'i',
                },
              },
            ],
          },
          {
            transactionType: searchTransactionDto.transactionType
              ? searchTransactionDto.transactionType
              : { $exists: true },
          },
          {
            place: searchTransactionDto.place
              ? searchTransactionDto.place
              : { $exists: true },
          },
          {
            created: searchTransactionDto.dateRange
              ? {
                  $lt: searchTransactionDto.dateRange.end,
                  $gt: searchTransactionDto.dateRange.start,
                }
              : { $exists: true },
          },
          { category: category ? category.id : { $exists: true } },
        ],
        user: user.id,
      })
      .skip(
        searchTransactionDto.page > 0
          ? (searchTransactionDto.page - 1) * searchTransactionDto.size
          : 0,
      )
      .limit(searchTransactionDto.size)
      .sort(searchTransactionDto.sort)
      .populate('category')
    return transactions
  }

  async searchPlaces(
    searchPlaceDto: SearchPlaceDto,
    user: User,
  ): Promise<string[]> {
    const transactions = await this.transactionModel.find({
      place: { $regex: searchPlaceDto.place, $options: 'i' },
      user: user.id,
    })

    return transactions.map((t) => t.place)
  }

  async searchCategories(
    searchCategoryDto: SearchCategoryDto,
    user,
  ): Promise<Category[]> {
    return this.categoryModel.find({
      name: { $regex: searchCategoryDto.category, $options: 'i' },
      user: user.id,
    })
  }
}
