import { Injectable, OnModuleInit } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ConsumerService } from '../kafka/consumer.service';
import {
  generateNotificationContent,
  generateUrl,
  getNotificationType,
} from './helper/helper';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationType } from './types/notification.type';
import { UpsertNotificationDto } from './dto/upsert.notification';

@Injectable()
export class NotificationConsumer implements OnModuleInit {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly consumerService: ConsumerService,
    private readonly eventEmitter: EventEmitter2,
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
    const type = getNotificationType(key.toString());
    const data = JSON.parse(value.toString());

    // Prevent user from receiving notification about their own action
    if (data.userId === data.subject.id) return;

    const upsertData: UpsertNotificationDto = {
      type,
      diId: data.postId || data.subject.id,
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
        type === NotificationType.FOLLOW ? data.subject.id : data.postId,
      ),
      read: false,
    };

    let notification = {};
    if (type === NotificationType.LIKE || type === NotificationType.COMMENT) {
      notification = await this.notificationService.upsert(upsertData);
    } else {
      notification = await this.notificationService.create(upsertData);
    }

    this.eventEmitter.emit('notification', notification);
  }
}
