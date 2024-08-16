import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InboxService {
  constructor(private readonly prisma: PrismaService) {}

  async getInbox({
    userId,
    skip,
    take,
  }: {
    userId: string;
    skip?: number;
    take?: number;
  }) {
    return this.prisma.client.subcription.findMany({
      where: {
        userId: userId,
      },
      include: {
        room: {
          include: {
            lastMessage: true,
          },
        },
      },
      orderBy: {
        room: {
          lastMessage: {
            createdAt: 'desc',
          },
        },
      },
      skip,
      take,
    });
  }

  async updateLastMessageRead({
    userId,
    roomId,
    lastMessageReadId,
  }: {
    userId: string;
    roomId: string;
    lastMessageReadId: string;
  }) {
    return this.prisma.subcription.upsert({
      where: {
        userId_roomId: {
          userId,
          roomId,
        },
      },
      create: {
        userId,
        roomId,
        lastMessageReadId,
        setting: {
          mute: false,
          push: true,
        },
      },
      update: {
        lastMessageReadId,
      },
    });
  }

  async countUnreadInbox({ userId }: { userId: string }) {
    const subcriptions = await this.prisma.client.subcription.findMany({
      where: {
        userId: userId,
      },
    });
    return {
      count: subcriptions.filter((s) => s.unread).length,
    };
  }
}
