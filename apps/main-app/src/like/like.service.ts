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
    // Create a new like
    const newLike = await this.prismaService.like.create(params);

    // Get the profile and post
    const profile = this.prismaService.profile.findUnique({
      where: {
        userId: newLike.userId,
      },
    });

    const postId = newLike.postId || '';
    const post = this.prismaService.post.findUnique({
      where: {
        id: postId,
      },
    });

    Promise.all([profile, post]).then(([profile, post]) => {
      if (!post || !profile) {
        throw new Error('Post or profile not found');
      }

      const payload: NotificationPayload = {
        postId: newLike.postId,
        userId: post.userId,
        subject: {
          id: newLike.userId,
          name: profile.name,
          imageUrl: profile.avatar,
        },
        diObject: {
          id: postId,
          name: post.content,
          imageUrl: null,
        },
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
