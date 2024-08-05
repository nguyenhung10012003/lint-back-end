import { AccessTokenGuard } from '@app/common/guards';
import { ErrorInterceptor } from '@app/common/interceptors/error.interceptor';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TagQuery } from './model/tag.query';
import { TagService } from './tag.service';

@Controller('tag')
@UseGuards(AccessTokenGuard)
@UseInterceptors(ErrorInterceptor)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  getTags(@Query() q: TagQuery) {
    return this.tagService.findMany({
      skip: q.skip,
      take: q.take,
      where: {
        name: {
          contains: q.search,
        },
      },
    });
  }

  @Get(':id')
  getTag(@Query('id') id: string) {
    return this.tagService.findOne({ id: +id });
  }

  @Post()
  createTag(@Body() tag: { name: string }) {
    return this.tagService.create(tag);
  }
}
