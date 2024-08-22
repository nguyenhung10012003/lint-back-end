import { IsString, IsOptional, IsObject } from 'class-validator';
import { $Enums } from '@prisma/prisma-notification-client';
import { Type } from 'class-transformer';

export class UpsertNotificationDto {
  @Type(() => String)
  type: $Enums.NotificationType;

  @IsString()
  @IsOptional()
  diId: string;

  @IsString()
  userId: string;

  @IsObject()
  content: Content;

  @IsString()
  subjectsId: string[];

  @IsString()
  @IsOptional()
  subjectUrl: string | null;

  @IsString()
  @IsOptional()
  diUrl: string | null;

  @IsString()
  url: string;

  @IsString()
  @IsOptional()
  read: boolean = false;
}

class Content {
  text: string;
  highlights: Highlight[];
}
class Highlight {
  length: number;
  offset: number;
}
