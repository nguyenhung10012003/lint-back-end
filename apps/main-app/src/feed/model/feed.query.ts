import { SkipQuery, TakeQuery } from '@app/common/types';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class FeedQuery implements SkipQuery, TakeQuery {
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
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  idsNotIn?: string[];

  extract() {
    return {
      skip: this.skip,
      take: this.take,
      idsNotIn: this.idsNotIn,
    };
  }
}
