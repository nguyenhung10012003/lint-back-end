import { SkipQuery, TakeQuery } from '@app/common/types';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class TagQuery implements SkipQuery, TakeQuery {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  skip?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  take?: number;

  @IsOptional()
  search?: string;
}
