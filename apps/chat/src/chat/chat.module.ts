import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MessageModule } from '../message/message.module';
import { RoomModule } from '../room/room.module';
import { SessionModule } from '../session/session.module';
import { ChatGateway } from './chat.gateway';
import { InboxModule } from '../inbox/inbox.module';

@Module({
  imports: [MessageModule, SessionModule, RoomModule, InboxModule],
  controllers: [],
  providers: [ChatGateway, JwtService],
})
export class ChatModule {}
