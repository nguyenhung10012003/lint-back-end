import { $Enums } from '@prisma/prisma-main-client';
import { Type } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';

export interface PostDto {
  content?: string;
  tags?: string[];
  sourceId?: string;
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
