import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationModule } from './notification/notification.module';
import { KafkaModule } from '@app/common/kafka/kafka.module';
import { SocketModule } from './socket/socket.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    RedisModule.forRoot({
      type: 'single',
      url: process.env.REDIS_URL,
    }),
    NotificationModule,
    KafkaModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
