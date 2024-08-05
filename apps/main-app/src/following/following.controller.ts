import { AccessTokenGuard } from '@app/common/guards';
import {
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FollowingService } from './following.service';
import { ErrorInterceptor } from '@app/common/interceptors/error.interceptor';

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
    return this.followingService.delete({
      id: req.body.id,
      followerId: req.body.followerId,
      followingId: req.body.followingId,
    });
  }

  @Get()
  async find(
    @Query()
    query: {
      followerId?: string;
      followingId?: string;
      skip?: number;
      take?: number;
    },
  ) {
    return this.followingService.find({
      where: {
        followerId: query.followerId,
        followingId: query.followingId,
      },
      skip: query.skip,
      take: query.take,
    });
  }

  @Get('/count')
  async count(
    @Query()
    query: {
      followerId: string;
      followingId: string;
    },
  ) {
    return this.followingService.count(query);
  }
}
