import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindParams {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsNumber()
  @IsOptional()
  skip: number;

  @IsNumber()
  take: number;

  orderBy: 'asc' | 'desc';
}
