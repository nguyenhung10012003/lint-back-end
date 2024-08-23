import { Injectable, OnModuleInit } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ConsumerService } from '@app/common/kafka/consumer.service';
import { generateNotificationContent, generateUrl } from './helper/helper';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UpsertNotificationDto } from './dto/upsert.notification';
import { $Enums } from '@prisma/prisma-notification-client';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class NotificationConsumer implements OnModuleInit {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly consumerService: ConsumerService,
    private readonly eventEmitter: EventEmitter2,
    @InjectRedis() private readonly redis: Redis,
  ) {}
  async onModuleInit() {
    await this.consumerService.consume(
      { topics: ['notification'] },
      {
        eachMessage: async ({ message }) => {
          const { key, value } = message;
          try {
            if (key && value) {
              await this.onMessage(key, value);
            }
          } catch (error) {
            console.error(error);
          }
        },
      },
    );
  }

  async onMessage(key: Buffer, value: Buffer) {
    const type = $Enums.NotificationType[key.toString().toUpperCase()];
    const data = JSON.parse(value.toString());

    // Prevent user from receiving notification about their own action
    if (data.userId === data.subject.id) return;

    const upsertData: UpsertNotificationDto = {
      type,
      diId: data.diObject.id,
      userId: data.userId,
      content: generateNotificationContent(
        type,
        data.subject.name,
        data.diObject.name,
      ),
      subjectsId: [data.subject.id],
      subjectUrl: data.subject.imageUrl,
      diUrl: data.diObject.imageUrl,
      url: generateUrl(
        type,
        ['FOLLOW', 'FOLLOW_REQUEST'].includes(type)
          ? data.subject.id
          : data.postId,
      ),
      read: false,
    };

    const notification = await this.notificationService.upsert(upsertData);

    const notPush = await this.redis.get(
      `${notification.type}_${notification.diId}_${notification.diId}`,
    );
    if (!notPush) {
      this.eventEmitter.emit('notification', notification);
      await this.redis.set(
        `${notification.type}_${notification.diId}_${notification.diId}`,
        '1',
        'EX',
        60 * 10, // 10 minutes
      );
    }
  }
}
