export class ResponseNotifications {
  notifications: Notification[];
  hasMore: boolean;
}
export class Notification {
  id: string;
  userId: string;
  diObject: Obj | null;
  subject: Obj;
  url: string;
  content: Content;
  read: boolean;
  lastModified: string;
}

export class Obj {
  id: string;
  name: string | null;
  imageUrl: string | null;
}

export class Content {
  text: string;
  highlights: Highlight[];
}

export class Highlight {
  length: number;
  offset: number;
}
