import { $Enums } from '@prisma/prisma-main-client';
import { IsOptional } from 'class-validator';

export class LikeDto {
  @IsOptional()
  postId?: string;
  @IsOptional()
  commentId?: string;
  @IsOptional()
  for: string = 'post';

  extract() {
    return {
      postId: this.postId || null,
      commentId: this.commentId || null,
      for: $Enums.LikeFor[this.for.toUpperCase()],
    };
  }
}
