import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/prisma-main-client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async create(params: {
    data: Prisma.PostCreateInput;
    include?: Prisma.PostInclude;
  }) {
    return await this.prisma.post.create({
      data: params.data,
      include: params.include || {
        medias: true,
        tags: true,
      },
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.PostWhereInput;
    include?: Prisma.PostInclude;
    orderBy?: Prisma.PostOrderByWithAggregationInput;
  }) {
    return this.prisma.post.findMany({
      ...params,
      include: params.include,
    });
  }

  async findOne(where: Prisma.PostWhereUniqueInput) {
    const post = await this.prisma.post.findUnique({
      where,
      include: { medias: true, tags: true },
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  /**
   * @deprecated Use search module to search post instead
   * Search for posts
   * @param params
   * @returns Array of posts
   */
  async search(params: {
    key?: string;
    skip?: number;
    take?: number;
    tags?: string[];
    idsNotIn?: string[];
  }) {
    return this.prisma.post.findMany({
      where: {
        content: params.key && { contains: params.key },
        tags: params.tags
          ? {
              some: {
                name: {
                  in: params.tags,
                },
              },
            }
          : undefined,
        id: params.idsNotIn && {
          notIn: params.idsNotIn,
        },
      },
      skip: params.skip || undefined,
      take: params.take || undefined,
      include: { medias: true, tags: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
