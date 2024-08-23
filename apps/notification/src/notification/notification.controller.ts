import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { FindParams } from './dto/find.params';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateStatusDto } from './dto/update.status';
import { Lang } from './types/lang';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  @Get()
  findMany(@Request() request, @Query() query: FindParams) {
    return this.notificationService.findMany({
      userId: request.user.sub,
      skip: query.skip,
      take: query.take,
      orderBy: query.orderBy,
    });
  }

  @Get('count-unread')
  countUnread(@Request() request): Promise<{ count: number }> {
    return this.notificationService.countUnread(request.user.sub);
  }

  @Patch(':id')
  updateStatus(
    @Request() request,
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<void> {
    return this.notificationService.updateStatus({
      id: id,
      userId: request.user.sub,
      read: updateStatusDto.read,
    });
  }

  @Delete(':id')
  delete(@Request() request, @Param('id') id: string): Promise<void> {
    return this.notificationService.delete({
      id: id,
      userId: request.user.sub,
    });
  }

  @Patch('/user/language')
  updateLanguage(@Request() request, @Body() { lang }: { lang: string }) {
    console.log(lang);
    return this.notificationService.changeLanguage({
      lang: Lang[lang.toUpperCase() as keyof typeof Lang],
      userId: request.user.sub,
    });
  }
}
