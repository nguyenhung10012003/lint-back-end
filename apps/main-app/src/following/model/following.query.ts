import { SkipQuery, TakeQuery } from '@app/common/types';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FollowingQuery implements TakeQuery, SkipQuery {
  @IsOptional()
  @IsString()
  variant: 'followers' | 'following';

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  take?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  skip?: number;

  @IsOptional()
  where?: any;

  @IsOptional()
  @IsString()
  userId?: string;

  extract() {
    const condition = {
      profile: {
        OR: [
          {
            name: {
              contains: this.search,
            },
          },
          {
            alias: {
              contains: this.search,
            },
          },
        ],
      },
    };

    this.where =
      this.variant === 'followers'
        ? {
            followingId: this.userId,
            follower: condition,
          }
        : {
            followerId: this.userId,
            following: condition,
          };

    return {
      skip: this.skip,
      take: this.take,
      select:
        this.variant === 'followers'
          ? {
              id: true,
              follower: {
                select: {
                  profile: true,
                },
              },
            }
          : {
              id: true,
              following: {
                select: {
                  profile: true,
                },
              },
            },
      where: this.where,
    };
  }
}
