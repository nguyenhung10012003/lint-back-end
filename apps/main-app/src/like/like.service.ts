import { ProducerService } from '@app/common/kafka/provider.service';
import { NotificationPayload } from '@app/common/types/notification.payload';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/prisma-main-client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LikeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly producerService: ProducerService,
  ) {}
  async create(params: Prisma.LikeCreateArgs) {
    const newLike = await this.prismaService.like.create(params);

    const payload: NotificationPayload = {
      postId: newLike.postId,
      subjectId: newLike.userId,
      diId: newLike.postId,
      diName: '',
    };

    this.producerService.produce({
      topic: 'notification',
      messages: [
        {
          key: 'like',
          value: JSON.stringify(payload),
        },
      ],
    });

    return newLike;
  }

  async delete(where: Prisma.LikeWhereUniqueInput) {
    return this.prismaService.like.delete({ where });
  }

  async find(params: Prisma.LikeFindManyArgs) {
    return this.prismaService.like.findMany(params);
  }

  async count(where: Prisma.LikeWhereInput) {
    return {
      count: await this.prismaService.like.count({ where }),
    };
  }

  async exists(where: Prisma.LikeWhereInput) {
    return {
      exist: await this.prismaService.like
        .count({ where })
        .then((count) => count > 0),
    };
  }
}
