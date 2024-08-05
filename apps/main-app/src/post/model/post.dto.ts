import { $Enums } from '@prisma/prisma-main-client';

export interface PostDto {
  content?: string;
  views?: number;
  share?: number;
  tags?: string[];
  sourceId?: string;
  scope?: $Enums.PostScope;
}
