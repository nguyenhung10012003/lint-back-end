import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FindParams } from './dto/find.params';
import { NotificationWhereUniqueDto } from './dto/delete.notification';
import { UpdateStatusDto } from './dto/update.status';
import { updateContentOnLanguage, updateSubject } from './helper/helper';
import { UpsertNotificationDto } from './dto/upsert.notification';
import { Lang } from './types/lang';

@Injectable()
export class NotificationService {
  constructor(private prismaService: PrismaService) {}
  async create(data: UpsertNotificationDto, lang: Lang = Lang.VN) {
    const notification = await this.prismaService.notification.create({
      data: {
        ...data,
        compiledContent: updateContentOnLanguage(lang, data.content),
        lastModified: new Date(),
      },
    });
    const unreadCount = await this.countUnread(data.userId);
    return {
      ...notification,
      ...unreadCount,
    };
  }

  async upsert(data: UpsertNotificationDto, lang: Lang = Lang.VN) {
    const lastNotification = await this.prismaService.notification.findUnique({
      where: {
        type_diId_userId: {
          type: data.type,
          diId: data.diId,
          userId: data.userId,
        },
      },
    });

    const maxSubjectsIdSize = 20;
    if (lastNotification) {
      if (
        !lastNotification.subjectsId.includes(data.subjectsId[0]) &&
        lastNotification.subjectsId.length < maxSubjectsIdSize
      ) {
        data.subjectsId = [...lastNotification.subjectsId, ...data.subjectsId];
      } else {
        data.subjectsId = lastNotification.subjectsId;
      }
    } else {
      data.subjectsId = [data.subjectsId[0]];
    }

    if (data.subjectsId && data.subjectsId.length > 1) {
      data.content = updateSubject(data.content, data.subjectsId.length);
    }

    const upsertData = {
      ...data,
      compiledContent: updateContentOnLanguage(lang, data.content),
      lastModified: new Date(),
    };
    const notification = await this.prismaService.notification.upsert({
      where: {
        type_diId_userId: {
          type: data.type,
          diId: data.diId,
          userId: data.userId,
        },
      },
      create: upsertData,
      update: upsertData,
    });
    const unreadCount = await this.countUnread(data.userId);
    return {
      ...notification,
      ...unreadCount,
    };
  }

  async findMany(param: FindParams) {
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

    return notifications;
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
    await this.prismaService.notification.update({
      where: { id: updateStatusDto.id, userId: updateStatusDto.userId },
      data: { read: updateStatusDto.read },
    });
  }

  async delete(where: NotificationWhereUniqueDto): Promise<void> {
    await this.prismaService.notification.delete({
      where: {
        id: where.id,
        userId: where.userId,
      },
    });
  }
}
