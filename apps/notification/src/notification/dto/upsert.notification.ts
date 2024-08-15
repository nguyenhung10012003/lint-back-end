import { NotificationType } from '../types/notification.type';
import { IsString, IsOptional, IsNumber, IsObject } from 'class-validator';

export class UpsertNotificationDto {
  @IsNumber()
  type: NotificationType;

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
