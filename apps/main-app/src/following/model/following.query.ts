import { SkipQuery, TakeQuery } from '@app/common/types';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FollowingQuery implements TakeQuery, SkipQuery {
  @IsOptional()
  @IsString()
  variant: 'followers' | 'followings';

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

  @IsOptional()
  @IsString()
  accepted?: 'true' | 'false';

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

    if (!this.where) {
      this.where =
        this.variant === 'followers'
          ? {
              accepted: this.accepted ? this.accepted == 'true' : undefined,
              followingId: this.userId,
              follower: condition,
            }
          : {
              accepted: this.accepted ? this.accepted == 'true' : undefined,
              followerId: this.userId,
              following: condition,
            };
    }

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
              accepted: true,
              createdAt: true,
            }
          : {
              id: true,
              following: {
                select: {
                  profile: true,
                },
              },
              accepted: true,
              createdAt: true,
            },
      where: this.where,
    };
  }
}
