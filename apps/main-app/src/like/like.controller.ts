import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AccessTokenGuard } from '@app/common/guards';
import { ErrorInterceptor } from '@app/common/interceptors/error.interceptor';
import { CountQuery } from '@app/common/types';
import { throwError } from 'rxjs';
import { LikeService } from './like.service';
import { LikeDto } from './model/like.dto';
import { LikeQuery } from './model/like.query';

@Controller('like')
@UseGuards(AccessTokenGuard)
@UseInterceptors(ErrorInterceptor)
export class LikeController {
  constructor(private readonly likeService: LikeService) {}
  @Post()
  create(@Req() req: any, @Body() body: LikeDto) {
    return this.likeService.create({
      data: {
        userId: req.user.userId,
        ...body.extract(),
      },
    });
  }

  @Delete()
  delete(@Req() req: any) {
    return this.likeService.delete({
      userId: req.user.userId,
      id: req.body.id,
      postId: req.body.postId,
      commentId: req.body.commentId,
    });
  }

  @Get()
  find(@Query() query: LikeQuery) {
    return this.likeService.find(query.extract());
  }

  @Get('count')
  count(@Query() query: CountQuery) {
    return this.likeService.count({
      postId: query.postId ? query.postId + '' : undefined,
      commentId: query.commentId ? query.commentId + '' : undefined,
    });
  }

  @Get('exist')
  exists(
    @Req() req: any,
    @Query() query: { userId: string; postId: string; commentId: string },
  ) {
    return this.likeService.exists({
      userId: req.user.userId,
      postId: query.postId,
      commentId: query.commentId,
    });
  }
}
