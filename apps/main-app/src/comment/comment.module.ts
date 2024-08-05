import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { KafkaModule } from '@app/common/kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  controllers: [CommentController],
  providers: [CommentService, PrismaService],
})
export class CommentModule {}
