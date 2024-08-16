import { CommonModule } from '@app/common';
import { AccessTokenStrategy } from '@app/common/strategies';
import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { RoomModule } from './room/room.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [CommonModule, MessageModule, RoomModule, ChatModule, SessionModule],
  controllers: [],
  providers: [AccessTokenStrategy],
})
export class AppModule {}
