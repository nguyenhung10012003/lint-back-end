import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SessionService } from './session.service';

@Module({
  imports: [],
  controllers: [],
  providers: [PrismaService, SessionService],
  exports: [SessionService],
})
export class SessionModule {}
