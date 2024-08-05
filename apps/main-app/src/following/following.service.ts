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
  async create(params: {
    data: Prisma.FollowCreateInput;
    include?: Prisma.FollowInclude;
  }) {
    const follow = await this.prismaService.follow.create(params);

    const notificationPayload: NotificationPayload = {
      subjectId: follow.followerId,
      diId: follow.followingId,
    };

    this.producerService.produce({
      topic: 'notification',
      messages: [
        {
          key: 'follow',
          value: JSON.stringify(notificationPayload),
        },
      ],
    });

    return follow;
  }

  async delete(where: Prisma.FollowWhereUniqueInput) {
    return this.prismaService.follow.delete({ where });
  }

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
}
