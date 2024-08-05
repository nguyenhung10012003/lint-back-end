import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AwsS3Service } from '../s3/aws-s3.service';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [TagModule],
  controllers: [PostController],
  providers: [PostService, PrismaService, AwsS3Service],
  exports: [PostService],
})
export class PostModule {}
