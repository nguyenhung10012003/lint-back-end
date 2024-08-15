import { AccessTokenGuard } from '@app/common/guards';
import { ErrorInterceptor } from '@app/common/interceptors/error.interceptor';
import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SearchQuery } from './model/search.query';
import { SearchService } from './search.service';

@Controller('search')
@UseGuards(AccessTokenGuard)
@UseInterceptors(ErrorInterceptor)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('suggestion/name')
  async usernameAutocomplete(@Query() query: SearchQuery) {
    return this.searchService.usernameAutocomplete({
      query: query.q,
      size: query.take,
    });
  }

  @Get('user')
  async searchUsers(@Query() query: SearchQuery) {
    return this.searchService.searchUsers({
      query: query.q,
      size: query.take,
      from: query.skip,
    });
  }
}
