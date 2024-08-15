import { ProducerService } from '@app/common/kafka/provider.service';
import { NotificationPayload } from '@app/common/types/notification.payload';
import { BadRequestException, Injectable } from '@nestjs/common';
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

    if (newLike.postId) {
      const profile = this.prismaService.profile.findUnique({
        where: {
          userId: newLike.userId,
        },
      });

      const post = this.prismaService.post.findUnique({
        where: {
          id: newLike.postId,
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
            id: post.id,
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
    }

    return newLike;
  }

  async delete(where: Prisma.LikeWhereUniqueInput) {
    const { userId, postId, commentId } = where;

    if (!commentId && !postId) {
      throw new BadRequestException('CommentId or postId is required');
    }

    const deleteWhere: any = {};

    if (commentId) {
      deleteWhere['userId_commentId'] = {
        userId: userId,
        commentId: commentId,
      };
    }
    if (postId) {
      deleteWhere['userId_postId'] = {
        userId: userId,
        postId: postId,
      };
    }

    return this.prismaService.like.delete({
      where: deleteWhere,
    });
  }

  async find(params: Prisma.LikeFindManyArgs) {
    return this.prismaService.like.findMany(params);
  }

  async count(where: Prisma.LikeWhereInput) {
    const countWhere: Prisma.LikeWhereInput = {};
    if (where.commentId) {
      countWhere.commentId = where.commentId;
    }

    if (where.postId) {
      countWhere.postId = where.postId;
    }

    return {
      count: await this.prismaService.like.count({ where: countWhere }),
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
