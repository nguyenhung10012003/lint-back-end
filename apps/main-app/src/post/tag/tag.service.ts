import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/prisma-main-client';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class TagService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.TagCreateInput) {
    return this.prismaService.tag.create({ data });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.TagWhereInput;
    include?: Prisma.TagInclude;
    select?: Prisma.TagSelect;
    orderBy?: Prisma.TagOrderByWithAggregationInput;
  }) {
    return this.prismaService.tag.findMany(params);
  }

  async findOne(where: Prisma.TagWhereUniqueInput) {
    return this.prismaService.tag.findUnique({ where });
  }
}
