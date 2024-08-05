import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FeedService {
  constructor(private readonly prismaService: PrismaService) {}
  async getFeed(params: {
    skip?: number;
    take?: number;
    userId: string;
    idsNotIn?: string[];
  }) {
    const posts = await this.prismaService.post.findMany({
      where: {
        AND: [
          {
            id: {
              notIn: params.idsNotIn,
            },
          },
          {
            OR: [
              {
                userId: params.userId,
              },
              {
                author: {
                  followers: {
                    some: {
                      followerId: params.userId,
                    },
                  },
                },
              },
            ],
          },
        ],
      },
      skip: params.skip,
      take: params.take,
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (posts?.length === 0) {
      return this.prismaService.post.findMany({
        where: {
          id: {
            notIn: params.idsNotIn,
          },
        },
        skip: params.skip,
        take: params.take,
        orderBy: {
          createdAt: 'desc',
        },
      });
    }
    return posts;
  }
}
