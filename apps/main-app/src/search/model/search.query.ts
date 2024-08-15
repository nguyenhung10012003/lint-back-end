import { SkipQuery, TakeQuery } from '@app/common/types';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchQuery implements SkipQuery, TakeQuery {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  skip?: number;
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  take?: number;
  @IsString()
  q: string;
}
