import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/prisma-main-client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BlacklistService {
  constructor(private readonly prismaService: PrismaService) {}

  async update(params: {
    data: Prisma.BlacklistCreateInput;
    where: Prisma.BlacklistWhereUniqueInput;
  }) {
    return this.prismaService.blacklist.upsert({
      create: params.data,
      update: params.data,
      where: params.where,
    });
  }

  async findOne(params: Prisma.BlacklistFindUniqueArgs) {
    return this.prismaService.blacklist.findUnique(params);
  }
}
