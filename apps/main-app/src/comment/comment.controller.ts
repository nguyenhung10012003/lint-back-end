import { AccessTokenGuard } from '@app/common/guards';
import { CountQuery } from '@app/common/types';
import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentQuery } from './model/comment.query';
import { ErrorInterceptor } from '@app/common/interceptors/error.interceptor';

@Controller('comment')
@UseGuards(AccessTokenGuard)
@UseInterceptors(ErrorInterceptor)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Req() req: any) {
    return this.commentService.create({
      data: {
        content: req.body.content,
        postId: req.body.postId,
        userId: req.user.userId,
        parentId: req.body.parentId,
      },
    });
  }

  @Get()
  find(
    @Query()
    query: CommentQuery,
  ) {
    return this.commentService.find(query.extract());
  }

  @Get('count')
  count(@Query() query: CountQuery) {
    return this.commentService.count({
      postId: query.postId + '',
    });
  }

  @Get(':id')
  findOne(@Req() req: any, @Query() query: { select?: string[] }) {
    return this.commentService.findOne({
      where: {
        id: req.params.id,
      },
    });
  }

  @Delete()
  delete(@Req() req: any) {
    return this.commentService.delete({
      where: {
        id: req.body.id,
        postId: req.body.postId,
        userId: req.user.userId,
      },
    });
  }

  @Patch()
  update(@Req() req: any) {
    return this.commentService.update({
      where: {
        id: req.body.id,
        postId: req.body.postId,
        userId: req.user.userId,
      },
      data: {
        content: req.body.content,
      },
    });
  }
}
