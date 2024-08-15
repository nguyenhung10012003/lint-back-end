import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { JwtService } from '@nestjs/jwt';
import { KafkaModule } from '../kafka/kafka.module';
import { NotificationConsumer } from './notification.consumer';

@Module({
  imports: [PrismaModule, KafkaModule],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationConsumer, JwtService],
})
export class NotificationModule {}
