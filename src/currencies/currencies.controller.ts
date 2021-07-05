import { Controller, Get } from '@nestjs/common'
import { CurrenciesService } from './currencies.service'

@Controller('transactions')
export class CurrenciesController {
  constructor(private readonly transactionsService: CurrenciesService) {}

  @Get()
  findAll() {
    return this.transactionsService.findAll()
  }
}
