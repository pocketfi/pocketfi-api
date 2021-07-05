import { DateRange } from '../interfaces/date-range.interface'

export class SearchTransactionDto {
  searchText: string
  transactionType: string
  category: string
  place: string
  dateRange: DateRange
  page: number
  size: number
  sort: string
}
