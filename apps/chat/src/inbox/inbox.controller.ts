import { AccessTokenGuard } from '@app/common/guards';
import { ErrorInterceptor } from '@app/common/interceptors/error.interceptor';
import { AuthenticatedRequest } from '@app/common/types';
import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InboxService } from './inbox.service';
import { InboxQuery } from './model/inbox.query';

@Controller('inbox')
@UseGuards(AccessTokenGuard)
@UseInterceptors(ErrorInterceptor)
export class InboxController {
  constructor(private readonly inboxService: InboxService) {}

  @Get()
  getInbox(@Req() req: AuthenticatedRequest, @Query() query: InboxQuery) {
    return this.inboxService.getInbox({
      userId: req.user.userId,
      skip: query.skip,
      take: query.take,
      lastTimestamp: query.lastTimestamp,
    });
  }

  @Get('count-unread')
  getUnreadCount(@Req() req: any) {
    return this.inboxService.countUnreadInbox(req.user.userId);
  }
}
