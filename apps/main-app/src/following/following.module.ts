import { Module } from '@nestjs/common';
import { KafkaModule } from '../../../../libs/common/src/kafka/kafka.module';
import { PrismaService } from '../prisma.service';
import { FollowingController } from './following.controller';
import { FollowingService } from './following.service';

@Module({
  imports: [KafkaModule],
  controllers: [FollowingController],
  providers: [FollowingService, PrismaService],
})
export class FollowingModule {}
