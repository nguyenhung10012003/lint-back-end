import { hashPassword } from '@app/common/utils/hashing';
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/prisma-main-client';
import { PrismaService } from '../prisma.service';
import { UserCreateInput } from './model/user.input';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithAggregationInput;
    include?: Prisma.UserInclude;
  }): Promise<User[]> {
    return this.prismaService.user.findMany(params);
  }

  async findOne(params: {
    where: Prisma.UserWhereUniqueInput;
    include?: Prisma.UserInclude;
  }): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: params.where,
      include: {
        profile: true,
      },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    UserCreateInput.parse(data);
    return this.prismaService.user.create({
      data: {
        email: data.email,
        password: await hashPassword(data.password),
      },
    });
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    return this.prismaService.user.update(params);
  }
}
