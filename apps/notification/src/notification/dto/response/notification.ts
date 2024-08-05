export class ResponseNotifications {
  notifications: Notification[];
  hasMore: boolean;
}
export class Notification {
  id: string;

  userId: string;
  diObject?: Obj | undefined;
  subject: Obj | undefined;
  url: string;
  content: Content | undefined;
  read: boolean;
  lastModified: string;
}

export class Obj {
  id: string;
  name?: string | undefined;
  imageUrl?: string | undefined;
}

export class Content {
  text: string;
  highlights: Highlight[];
}

export class Highlight {
  length: number;
  offset: number;
}
