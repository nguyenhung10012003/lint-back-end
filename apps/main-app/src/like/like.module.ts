import { KafkaModule } from '@app/common/kafka/kafka.module';
import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';

@Module({
  imports: [KafkaModule],
  controllers: [LikeController],
  providers: [LikeService, PrismaService],
})
export class LikeModule {}
