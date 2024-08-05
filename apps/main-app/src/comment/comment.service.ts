import { ProducerService } from '@app/common/kafka/provider.service';
import { NotificationPayload } from '@app/common/types/notification.payload';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/prisma-main-client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly producerService: ProducerService,
  ) {}

  async create(params: Prisma.CommentCreateArgs) {
    const newComment = await this.prismaService.comment.create(params);

    const payload: NotificationPayload = {
      postId: newComment.postId,
      subjectId: newComment.userId,
      diId: newComment.id,
      diName: newComment.content,
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
