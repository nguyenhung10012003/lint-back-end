import { AccessTokenGuard } from '@app/common/guards';
import {
  Controller,
  Delete,
  Get,
  Post,
  Patch,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FollowingService } from './following.service';
import { ErrorInterceptor } from '@app/common/interceptors/error.interceptor';
import { FollowingQuery } from './model/following.query';

@Controller('following')
@UseGuards(AccessTokenGuard)
@UseInterceptors(ErrorInterceptor)
export class FollowingController {
  constructor(private readonly followingService: FollowingService) {}

  @Post()
  async follow(@Req() req: any) {
    return this.followingService.create({
      data: {
        follower: {
          connect: { id: req.user.userId },
        },
        following: {
          connect: { id: req.body.followingId },
        },
      },
      include: req.body.include?.map((i: string) => ({ [i]: true })),
    });
  }

  @Delete()
  async unfollow(@Req() req: any) {
    const where = req.body.id
      ? { id: req.body.id }
      : {
          followerId_followingId: {
            followerId: req.user.userId,
            followingId: req.body.followingId,
          },
        };
    return this.followingService.delete(where);
  }

  @Get()
  async find(
    @Query()
    query: FollowingQuery,
  ) {
    return await this.followingService.find({
      ...query.extract(),
    });
  }

  @Get('/count')
  async count(
    @Query()
    query: {
      followerId?: string;
      followingId?: string;
      accepted?: string;
    },
  ) {
    const accepted = query.accepted === 'false' ? false : true;
    return this.followingService.count({ ...query, accepted });
  }

  @Patch('/accept')
  async accept(@Req() req: any) {
    return this.followingService.accept({
      where: {
        id: req.body.id,
      },
    });
  }
}
