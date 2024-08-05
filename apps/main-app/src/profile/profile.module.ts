import { Module } from '@nestjs/common';
import { AwsS3Service } from '../s3/aws-s3.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, AwsS3Service, PrismaService],
})
export class ProfileModule {}
