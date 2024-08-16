import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InboxService } from './inbox.service';
import { InboxController } from './inbox.controller';

@Module({
  imports: [],
  controllers: [InboxController],
  providers: [InboxService, PrismaService],
  exports: [InboxService],
})
export class InboxModule {}
