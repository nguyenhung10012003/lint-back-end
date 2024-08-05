import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';

@Module({
  imports: [],
  controllers: [FeedController],
  providers: [FeedService, PrismaService],
})
export class FeedModule {}
