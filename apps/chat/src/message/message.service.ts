import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/prisma-chat-client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}
  async createMessage(params: Prisma.MessageCreateArgs) {
    return this.prisma.client.createMessage(params);
  }

  async getMessages(params: Prisma.MessageFindManyArgs) {
    return this.prisma.message.findMany(params);
  }

  async getMessage(params: Prisma.MessageFindUniqueArgs) {
    return this.prisma.message.findUnique(params);
  }

  async updateMessage(params: Prisma.MessageUpdateArgs) {
    return this.prisma.message.update(params);
  }

  async softDeleteMessage(params: {
    where: Prisma.MessageWhereUniqueInput;
    include?: Prisma.MessageInclude;
  }) {
    return this.prisma.message.update({
      where: params.where,
      data: { deleted: true },
    });
  }

  async deleteMessage(params: Prisma.MessageDeleteArgs) {
    return this.prisma.message.delete(params);
  }
}
