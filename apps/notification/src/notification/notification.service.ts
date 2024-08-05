import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FindParams } from './dto/request/find.params';
import { ResponseNotifications } from './dto/response/notification';
import { NotificationWhereUniqueDto } from './dto/request/delete.notification';
import { UpdateStatusDto } from './dto/request/update.status';

@Injectable()
export class NotificationService {
  constructor(private prismaService: PrismaService) {}

  async findMany(param: FindParams): Promise<ResponseNotifications> {
    const notifications = await this.prismaService.notification.findMany({
      where: {
        userId: param.userId,
      },
      skip: param.skip,
      take: param.take,
      orderBy: {
        createdAt: param.orderBy == 'asc' ? 'asc' : 'desc',
      },
    });

    const totalNotifications = await this.prismaService.notification.count({
      where: {
        userId: param.userId,
      },
    });

    const hasMore = param.skip + param.take < totalNotifications;

    return {
      notifications: notifications.map((notification) => {
        return {
          id: notification.id,
          userId: notification.userId,
          content: JSON.parse(notification.compiledContent.toString()),
          diObject: notification.diObject,
          subject: notification.subjects[notification.subjects.length - 1],
          url: notification.url,
          read: notification.read,
          lastModified: notification.lastModified.toISOString(),
        };
      }),
      hasMore: hasMore,
    };
  }

  async countUnread(userId: string) {
    const unreadCount = await this.prismaService.notification.count({
      where: {
        userId: userId,
        read: false,
      },
    });

    return {
      count: unreadCount,
    };
  }

  async updateStatus(updateStatusDto: UpdateStatusDto) {
    const existNoti = await this.prismaService.notification.findUnique({
      where: {
        id: updateStatusDto.id,
      },
    });
    if (!existNoti || existNoti.userId !== updateStatusDto.userId) {
      throw new BadRequestException('Notification not found');
    }

    await this.prismaService.notification.update({
      where: { id: updateStatusDto.id },
      data: { read: updateStatusDto.read },
    });
  }

  async delete(where: NotificationWhereUniqueDto): Promise<void> {
    const isExist = await this.prismaService.notification.findUnique({
      where: {
        id: where.id,
      },
    });

    if (!isExist || isExist.userId !== where.userId) {
      throw new BadRequestException('Notification not found');
    }

    await this.prismaService.notification.delete({
      where: {
        id: where.id,
      },
    });
  }
}
