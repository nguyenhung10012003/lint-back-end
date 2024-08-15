import { $Enums } from '@prisma/prisma-main-client';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';

export class PostDto {
  @IsOptional()
  content?: string;
  @IsOptional()
  @IsArray()
  @Type(() => String)
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  tags?: string[];
  @IsOptional()
  sourceId?: string;
  @IsOptional()
  @Type(() => String)
  scope?: $Enums.PostScope;
}

export class PostUpdateDto {
  @IsOptional()
  content?: string;
  @IsOptional()
  @IsArray()
  @Type(() => String)
  tags?: string[];
  @IsOptional()
  @Type(() => String)
  scope?: $Enums.PostScope;
}
