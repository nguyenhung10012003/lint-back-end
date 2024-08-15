import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [ChatGateway, JwtService],
})
export class ChatModule {}
