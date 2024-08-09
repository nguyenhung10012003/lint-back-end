import { IncludeQuery, SkipQuery, TakeQuery } from '@app/common/types';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsIn, IsNumber, IsOptional } from 'class-validator';

export class UserQuery extends IncludeQuery implements TakeQuery, SkipQuery {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  take?: number;
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  skip?: number;
  @IsOptional()
  @IsArray()
  @Type(() => String)
  @IsIn(['id', 'email', 'password', 'createdAt', 'updatedAt', 'profile'], {
    each: true,
  })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  include?: string[] = ['profile'];
  @IsArray()
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  id?: string[];
  extract() {
    return {
      skip: this.skip,
      take: this.take,
      include: this.extractInclude(),
      where: {
        id: {
          in: this.id,
        },
      },
    };
  }
}
