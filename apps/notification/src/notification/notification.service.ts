import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FindParams } from './dto/request/find.params';
import { ResponseNotifications } from './dto/response/notification';
import { NotificationWhereUniqueDto } from './dto/request/delete.notification';
import { UpdateStatusDto } from './dto/request/update.status';
import { ConsumerService } from '../kafka/consumer.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  generateNotificationContent,
  generateUrl,
  getNotificationType,
  updateContentOnLanguage,
} from './helper/helper';
import { CreateNotificationDto } from './dto/request/create.notification';
import { NotificationType } from './types/NotificationType';

@Injectable()
export class NotificationService implements OnModuleInit {
  constructor(
    private prismaService: PrismaService,
    private consumerService: ConsumerService,
    private eventEmitter: EventEmitter2,
  ) {}

  async onModuleInit() {
    await this.consumerService.consume(
      { topics: ['notification'] },
      {
        eachMessage: async ({ message }) => {
          const { key, value } = message;
          try {
            await this.handleNotification(key, value);
          } catch (error) {
            console.error(error);
          }
        },
      },
    );
  }

  async handleNotification(key: Buffer, value: Buffer) {
    const toStringKey = key.toString();
    const type: number = getNotificationType(toStringKey);

    const toStringValue = value.toString();
    const parsedValue = JSON.parse(toStringValue);
    const data: CreateNotificationDto = parsedValue;
    await this.upsert(data, type);
  }

  async upsert(upsertDto: CreateNotificationDto, type: number) {
    let notification = null;
    // only upsert if notification is like or comment type
    if (type === NotificationType.LIKE || type === NotificationType.COMMENT) {
      notification = await this.prismaService.notification.findFirst({
        where: {
          AND: [
            {
              type: type.toString(),
            },
            { postId: upsertDto.postId },
            { userId: upsertDto.userId },
          ],
        },
      });
    }

    let updateSubject = true;
    if (notification) {
      for (const subject of notification.subjects) {
        if (subject.id === upsertDto.subject.id) {
          updateSubject = false;
        }
      }
    }

    const subjectCount = notification
      ? notification.subjectCount + updateSubject
      : 1;
    const content = generateNotificationContent(
      upsertDto.subject.name,
      subjectCount,
      type,
      upsertDto.diObject.name,
    );

    // TODO: implement user setting language
    const data = {
      type: type.toString(),
      postId: upsertDto.postId,
      diObject: upsertDto.diObject,
      userId: upsertDto.userId,
      content: JSON.stringify(content),
      compiledContent: JSON.stringify(updateContentOnLanguage(0, content)),
      subjects: notification
        ? updateSubject
          ? [...notification.subjects, upsertDto.subject]
          : notification.subjects
        : [upsertDto.subject],
      subjectCount: subjectCount,
      url:
        type === NotificationType.FOLLOW
          ? generateUrl(type, upsertDto.subject.id)
          : generateUrl(type, upsertDto.postId),
      read: false,
      lastModified: new Date().toISOString(),
    };

    const upsertNoti = await this.prismaService.notification.upsert({
      where: {
        id: notification.id,
      },
      create: data,
      update: data,
    });

    const unreadCount = await this.prismaService.notification.count({
      where: {
        userId: upsertDto.userId,
        read: false,
      },
    });
    const lastSubject = upsertNoti.subjects[upsertNoti.subjects.length - 1];
    this.eventEmitter.emit('notification', {
      id: upsertNoti.id,
      content: JSON.parse(upsertNoti.compiledContent.toString()),
      subject: lastSubject,
      diObject: upsertNoti.diObject,
      url: upsertNoti.url,
      read: upsertNoti.read,
      lastModified: upsertNoti.lastModified,
      unreadCount: unreadCount,
    });
  }

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