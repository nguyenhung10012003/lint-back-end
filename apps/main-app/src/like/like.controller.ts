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
    // Delete the like of a post
    if (req.body.postId) {
      return this.likeService.delete({
        userId_postId: {
          userId: req.user.userId,
          postId: req.body.postId,
        },
      });
    }

    // Delete the like of a comment
    if (req.body.commentId) {
      return this.likeService.delete({
        userId_commentId: {
          userId: req.user.userId,
          commentId: req.body.commentId,
        },
      });
    }

    // return an error if the request is not included in the above cases
    return throwError(() => new BadRequestException('Invalid request'));
  }

  @Get()
  find(@Query() query: LikeQuery) {
    return this.likeService.find(query.extract());
  }

  @Get('count')
  count(@Query() query: CountQuery) {
    return this.likeService.count({
      postId: query.postId + '',
    });
  }

  @Get('exist')
  exists(@Req() req: any, @Query() query: { userId: string; postId: string }) {
    return this.likeService.exists({
      userId: req.user.userId,
      postId: query.postId,
    });
  }
}
