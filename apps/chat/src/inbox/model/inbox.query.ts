import { SkipQuery, TakeQuery } from '@app/common/types';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class InboxQuery implements SkipQuery, TakeQuery {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  skip?: number;
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  take?: number;
}
