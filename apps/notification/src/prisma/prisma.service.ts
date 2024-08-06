import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/prisma-notification-client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
  }
}
