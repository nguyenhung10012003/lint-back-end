import { IncludeQuery, SkipQuery, TakeQuery } from '@app/common/types';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsIn, IsNumber, IsOptional } from 'class-validator';

export class LikeQuery extends IncludeQuery implements SkipQuery, TakeQuery {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  take?: number;
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  skip?: number;

  @IsOptional()
  @Type(() => String)
  postId?: string;

  @IsOptional()
  @Type(() => String)
  @IsArray()
  @IsIn(['post', 'user', 'comment'], { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  include?: string[];

  extract() {
    return {
      include: this.extractInclude(),
      take: this.take,
      skip: this.skip,
      where: {
        postId: this.postId,
      },
    };
  }
}
