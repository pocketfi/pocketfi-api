import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { SearchService } from './search.service'
import { AuthGuard } from '@nestjs/passport'
import { SearchTransactionDto } from './dto/search-transaction.dto'
import { SearchPlaceDto } from './dto/search-place.dto'
import { SearchCategoryDto } from './dto/search-category.dto'

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post('transactions')
  @UseGuards(AuthGuard())
  searchTransactions(
    @Body() searchTransactionDto: SearchTransactionDto,
    @Req() req: any,
  ) {
    return this.searchService.searchTransactions(searchTransactionDto, req.user)
  }

  @Post('places')
  @UseGuards(AuthGuard())
  searchPlaces(@Body() searchPlaceDto: SearchPlaceDto, @Req() req: any) {
    return this.searchService.searchPlaces(searchPlaceDto, req.user)
  }

  @Post('categories')
  @UseGuards(AuthGuard())
  searchCategories(@Body() category: SearchCategoryDto, @Req() req: any) {
    return this.searchService.searchCategories(category, req.user)
  }
}
