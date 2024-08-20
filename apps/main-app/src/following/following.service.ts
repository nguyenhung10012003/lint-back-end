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
    const following = await this.prismaService.user.findUnique({
      where: {
        id: params.data.following.connect?.id,
      },
    });

    if (following?.isPrivate) {
      params.data.accepted = false;
    }

    const follow = await this.prismaService.follow.create(params);

    const profile = this.prismaService.profile.findUnique({
      where: {
        userId: follow.followerId,
      },
    });

    profile.then((profile) => {
      if (!profile) {
        throw new Error('Post or profile not found');
      }

      const payload: NotificationPayload = {
        postId: null,
        userId: follow.followingId,
        subject: {
          id: follow.followerId,
          name: profile.name,
          imageUrl: profile.avatar,
        },
        diObject: {
          id: follow.followingId,
          name: null,
          imageUrl: null,
        },
      };
      this.producerService.produce({
        topic: 'notification',
        messages: [
          {
            key: following?.isPrivate ? 'follow_request' : 'follow',
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
    console.log(params);
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
