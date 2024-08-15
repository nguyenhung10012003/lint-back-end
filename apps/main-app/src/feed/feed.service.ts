import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FeedService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Get feed for a user
   * @param skip number of posts to skip
   * @param take number of posts to take
   * @param userId user id
   * @param idsNotIn list of post ids to exclude
   * @returns a list of posts
   */
  async getFeed(params: {
    skip?: number;
    take?: number;
    userId: string;
    idsNotIn?: string[];
  }) {
    // Get posts from the user and the user's followers
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
      include: {
        medias: true,
      },
      skip: params.skip,
      take: params.take,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        medias: true,
        tags: true,
      },
    });

    // If there are no posts, return the latest posts
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
        include: {
          medias: true,
        },
      });
    }
    return posts;
  }
}
