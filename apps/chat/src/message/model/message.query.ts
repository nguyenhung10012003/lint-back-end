import { IncludeQuery, SkipQuery, TakeQuery } from '@app/common/types';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsNumber, IsOptional } from 'class-validator';

export class MessageQuery extends IncludeQuery implements SkipQuery, TakeQuery {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  skip?: number;
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  take?: number;
  @IsOptional()
  roomId?: string;
  @IsOptional()
  @IsArray()
  @IsOptional()
  @Type(() => String)
  @IsIn(['room', 'replies', 'replyTo'], { each: true })
  include?: string[];
  @IsOptional()
  @IsIn(['createdAt', 'updatedAt'])
  orderField?: 'createdAt' | 'updatedAt';
  @IsOptional()
  @IsIn(['asc', 'desc'])
  orderDirection?: 'asc' | 'desc';

  extract() {
    return {
      skip: this.skip,
      take: this.take,
      where: {
        roomId: this.roomId,
      },
      include: super.extractInclude(),
      orderBy: {
        [this.orderField || 'createdAt']:
          this.orderDirection === 'asc' ? 'asc' : 'desc',
      },
    };
  }
}
