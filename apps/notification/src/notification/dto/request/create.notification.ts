import { Obj } from '../response/notification';

export class CreateNotificationDto {
  postId: string;
  userId: string;
  subject: Obj;
  diObject: Obj;
}
