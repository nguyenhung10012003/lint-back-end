import { IncludeQuery, SkipQuery, TakeQuery } from '@app/common/types';
import { Prisma } from '@prisma/prisma-main-client';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsNumber, IsOptional } from 'class-validator';

export class PostQuery extends IncludeQuery implements TakeQuery, SkipQuery {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  skip?: number;
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  take?: number;
  @IsArray()
  @IsOptional()
  @IsIn(
    [
      'author',
      'comments',
      'medias',
      'tags',
    ],
    { each: true },
  )
  @Type(() => String)
  include?: string[] = ['medias', 'tags'];
  orderField?: 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
  @IsArray()
  @IsOptional()
  @Type(() => String)
  userId?: string[];
  @IsArray()
  @IsOptional()
  @Type(() => String)
  idsNotIn?: string[];

  extract() {
    return {
      skip: this.skip,
      take: this.take,
      include: this.extractInclude(),
      orderBy: {
        [this.orderField || 'createdAt']:
          this.orderDirection === 'asc'
            ? Prisma.SortOrder.asc
            : Prisma.SortOrder.desc,
      },
      where: {
        userId: {
          in: this.userId,
        },
        id: {
          notIn: this.idsNotIn,
        },
      },
    };
  }
}
