import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [],
  controllers: [MessageController],
  providers: [PrismaService,  MessageService],
  exports: [MessageService],
})
export class MessageModule {}
