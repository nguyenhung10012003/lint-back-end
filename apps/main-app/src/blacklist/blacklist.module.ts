import { Module } from '@nestjs/common';
import { BlacklistController } from './blacklist.controller';
import { BlacklistService } from './blacklist.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [BlacklistController],
  providers: [BlacklistService, PrismaService],
})
export class BlacklistModule {}
