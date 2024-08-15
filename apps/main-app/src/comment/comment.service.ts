import { ProducerService } from '@app/common/kafka/provider.service';
import { NotificationPayload } from '@app/common/types/notification.payload';
import { Injectable } from '@nestjs/common';
import { Prisma, $Enums } from '@prisma/prisma-main-client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly producerService: ProducerService,
  ) {}

  async create(params: Prisma.CommentCreateArgs) {
    const newComment = await this.prismaService.comment.create(params);

    const profile = this.prismaService.profile.findUnique({
      where: {
        userId: newComment.userId,
      },
    });

    const post = this.prismaService.post.findUnique({
      where: {
        id: newComment.postId,
      },
      include: {
        medias: true,
      },
    });

    Promise.all([profile, post]).then(([profile, post]) => {
      if (!post || !profile) {
        throw new Error('Post or profile not found');
      }

      const payload: NotificationPayload = {
        postId: newComment.postId,
        userId: post.userId,
        subject: {
          id: newComment.userId,
          name: profile.name,
          imageUrl: profile.avatar,
        },
        diObject: {
          id: newComment.postId,
          name: newComment.content,
          imageUrl:
            post.medias[0]?.type === $Enums.MediaType.IMAGE
              ? post.medias[0]?.url
              : null,
        },
      };

      this.producerService.produce({
        topic: 'notification',
        messages: [
          {
            key: 'comment',
            value: JSON.stringify(payload),
          },
        ],
      });
    });

    return newComment;
  }

  async delete(params: Prisma.CommentDeleteArgs) {
    return this.prismaService.comment.delete(params);
  }

  async find(params: Prisma.CommentFindManyArgs) {
    return this.prismaService.comment.findMany(params);
  }

  async findOne(params: Prisma.CommentFindUniqueArgs) {
    return this.prismaService.comment.findUnique(params);
  }

  async count(where: Prisma.CommentWhereInput) {
    return {
      count: await this.prismaService.comment.count({ where }),
    };
  }

  async update(params: Prisma.CommentUpdateArgs) {
    return this.prismaService.comment.update(params);
  }
}
