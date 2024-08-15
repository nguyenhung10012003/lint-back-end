import { $Enums } from '@prisma/prisma-chat-client';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @Type(() => String)
  @IsString()
  content: string;
  @Type(() => String)
  @IsOptional()
  roomId?: string;
  @Type(() => String)
  @IsOptional()
  @IsArray()
  members?: string[];
  @Type(() => String)
  @IsOptional()
  messageType: $Enums.MessageType = $Enums.MessageType.TEXT;
}

export class UpdateMessageDto {
  @Type(() => String)
  @IsString()
  content?: string;

  @Type(() => String)
  @IsOptional()
  @IsArray()
  readBy?: string[];
}
