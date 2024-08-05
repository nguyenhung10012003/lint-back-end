import { AccessTokenGuard } from '@app/common/guards';
import { Controller, Get, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedQuery } from './model/feed.query';
import { ErrorInterceptor } from '@app/common/interceptors/error.interceptor';

@Controller('feed')
@UseGuards(AccessTokenGuard)
@UseInterceptors(ErrorInterceptor)
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  getFeed(
    @Req() req: any,
    @Query()
    query: FeedQuery,
  ) {
    return this.feedService.getFeed({
      ...query.extract(),
      userId: req.user.userId,
    });
  }
}
