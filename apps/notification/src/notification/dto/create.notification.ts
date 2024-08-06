import { Obj } from './notification';
import { IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  postId?: string;

  @IsString()
  userId: string;

  subject: Obj;
  diObject: Obj;
}
