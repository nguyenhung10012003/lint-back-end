import { IncludeQuery, SkipQuery, TakeQuery } from '@app/common/types';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsNumber, IsOptional } from 'class-validator';

export class CommentQuery extends IncludeQuery implements TakeQuery, SkipQuery {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  skip?: number;
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  take?: number;
  @IsOptional()
  @Type(() => String)
  @IsArray()
  @IsIn(['likes', 'author', 'post', 'replies', 'comment'], { each: true })
  include?: string[] = ['likes', 'author'];
  @IsOptional()
  @Type(() => String)
  postId?: string;
  @IsOptional()
  @Type(() => String)
  @IsIn(['createdAt', 'updatedAt'])
  orderField?: string = 'updatedAt';
  @IsOptional()
  @Type(() => String)
  @IsIn(['asc', 'desc'])
  orderDirection?: string = 'desc';
  @IsOptional()
  @Type(() => String)
  parentId?: string;

  extract() {
    return {
      include: this.extractInclude(),
      skip: this.skip,
      take: this.take,
      where: { postId: this.postId, parentId: this.parentId || null },
      orderBy: {
        [this.orderField as string]: this.orderDirection,
      },
    };
  }
}
