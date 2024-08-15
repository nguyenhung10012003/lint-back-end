import { SkipQuery, TakeQuery } from '@app/common/types';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class RoomQuery implements SkipQuery, TakeQuery {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  skip?: number;
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  take?: number;
  @IsOptional()
  @Type(() => Boolean)
  withLastMessage?: boolean = true;
}
