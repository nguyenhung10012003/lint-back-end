import { Module } from '@nestjs/common';
import { BlacklistService } from './blacklist.service';
import { BlacklistController } from './blacklist.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [BlacklistController],
  providers: [BlacklistService, PrismaService],
})
export class BlacklistModule {}
