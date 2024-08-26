import { ProducerService } from '@app/common/kafka/provider.service';
import { NotificationPayload } from '@app/common/types';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/prisma-main-client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FollowingService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly producerService: ProducerService,
  ) {}

  /**
   * Create a follow
   * @param params
   * @returns a Follow model
   */
  async create(params: {
    data: Prisma.FollowCreateInput;
    include?: Prisma.FollowInclude;
  }) {
    const followingSetting = await this.prismaService.setting.findUnique({
      where: {
        userId: params.data.following.connect?.id,
      },
    });

    if (followingSetting?.status === 'PRIVATE') {
      params.data.accepted = false;
    }

    const follow = await this.prismaService.follow.create(params);

    const follower = this.prismaService.user.findUniqueOrThrow({
      where: {
        id: follow.followerId,
      },
      include: {
        profile: true,
      },
    });

    Promise.all([follower]).then(([follower]) => {
      const payload: NotificationPayload = {
        postId: null,
        userId: follow.followingId,
        subject: {
          id: follower.id,
          name: follower.profile?.name,
          imageUrl: follower.profile?.avatar,
        },
        diObject: {
          id: follow.id,
          name: null,
          imageUrl: null,
        },
        lang: followingSetting?.lang || 'VI',
      };
      this.producerService.produce({
        topic: 'notification',
        messages: [
          {
            key:
              followingSetting?.status === 'PRIVATE'
                ? 'follow_request'
                : 'follow',
            value: JSON.stringify(payload),
          },
        ],
      });
    });
    return follow;
  }

  async delete(where: Prisma.FollowWhereUniqueInput) {
    return this.prismaService.follow.delete({ where });
  }

  /**
   * Find many follows
   * @param params
   * @returns a Follow model array
   */
  async find(params: {
    where: Prisma.FollowWhereInput;
    skip?: number;
    take?: number;
    orderBy?: Prisma.FollowOrderByWithAggregationInput;
    include?: Prisma.FollowInclude;
  }) {
    return this.prismaService.follow.findMany(params);
  }

  async count(where: Prisma.FollowWhereInput): Promise<{ count: number }> {
    return {
      count: await this.prismaService.follow.count({ where }),
    };
  }

  async accept(params: { where: Prisma.FollowWhereUniqueInput }) {
    await this.prismaService.follow.update({
      where: params.where,
      data: {
        accepted: true,
      },
    });
  }
}
