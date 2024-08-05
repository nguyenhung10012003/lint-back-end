import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/prisma-main-client';
import { PrismaService } from '../prisma.service';
import { ProfileCreateInput } from './model/profile.input';

@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(params?: Prisma.ProfileFindManyArgs) {
    return this.prismaService.profile.findMany(params);
  }

  async findOne(userId: string) {
    return this.prismaService.profile.findUnique({
      where: {
        userId: userId,
      },
    });
  }

  async findById(id: string) {
    return this.prismaService.profile.findUnique({
      where: {
        id,
      },
    });
  }

  async create(data: Prisma.ProfileUncheckedCreateInput) {
    ProfileCreateInput.parse(data);
    return this.prismaService.profile.create({
      data,
    });
  }

  async update(params: Prisma.ProfileUpdateArgs) {
    return this.prismaService.profile.update(params);
  }
}
