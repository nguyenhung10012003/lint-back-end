import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindParams {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  skip: number;

  @IsNumber()
  @Type(() => Number)
  take: number;

  @IsOptional()
  orderBy: 'asc' | 'desc';
}
