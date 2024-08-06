export class NotificationPayload {
  postId: string | null;
  userId: string;

  subject: Obj;
  diObject: Obj;
}

class Obj {
  id: string;
  name: string | null;
  imageUrl: string | null;
}
