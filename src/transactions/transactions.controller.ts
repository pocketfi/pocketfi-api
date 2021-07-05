import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { TransactionsService } from './transactions.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { AuthGuard } from '@nestjs/passport'

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @UseGuards(AuthGuard())
  create(@Body() createTransactionDto: CreateTransactionDto, @Req() req: any) {
    return this.transactionsService.create(createTransactionDto, req.user)
  }

  @Get()
  @UseGuards(AuthGuard())
  findAll(@Req() req: any) {
    return this.transactionsService.findAll(req.user)
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  findOne(@Param('id') id: string, @Req() req: any) {
    console.log(id)
    return this.transactionsService.findOne(id, req.user)
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Req() req: any,
  ) {
    return this.transactionsService.update(id, updateTransactionDto, req.user)
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  remove(@Param('id') id: string, @Req() req: any) {
    return this.transactionsService.remove(id, req.user)
  }
}
