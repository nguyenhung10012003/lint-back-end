import { AccessTokenGuard } from '@app/common/guards';
import { ErrorInterceptor } from '@app/common/interceptors/error.interceptor';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { $Enums } from '@prisma/prisma-main-client';
import { AwsS3Service } from '../s3/aws-s3.service';
import { fileAcceptReg } from '../utils/media-accept';
import { PostDto } from './model/post.dto';
import { PostQuery } from './model/post.query';
import { PostService } from './post.service';

@Controller('post')
@UseGuards(AccessTokenGuard)
@UseInterceptors(ErrorInterceptor)
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly s3Service: AwsS3Service,
  ) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('medias', 10, {
      fileFilter: (req, file, cb) => {
        if (file) {
          if (!fileAcceptReg.test(file.mimetype))
            return cb(new BadRequestException('File is invalid type'), false);
          else if (file.size > +(process.env.MAX_MEDIA_FILE_SIZE || 0))
            return cb(new BadRequestException('File is too large'), false);
          cb(null, true);
        } else {
          cb(null, false);
        }
      },
    }),
  )
  async create(
    @Req() req: any,
    @Body() post: PostDto,
    @UploadedFiles()
    files?: Express.Multer.File[],
  ) {
    const medias = await this.s3Service.uploadFiles(files || []);
    return this.postService.create({
      data: {
        ...post,
        medias: medias && {
          create: medias.map((media) => ({
            type: $Enums.MediaType[media?.type],
            url: media.url,
          })),
        },
        author: {
          connect: {
            id: req.user.userId,
          },
        },
        tags: post.tags && {
          connect: post.tags.map((tag) => ({
            name: tag,
          })),
        },
      },
    });
  }

  @Get()
  async find(@Query() query: PostQuery) {
    return this.postService.findMany(query.extract());
  }

  @Get('search')
  async search(
    @Query('key') key: string,
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('tags') tags: string[] | undefined,
    @Query('idsNotIn') idsNotIn: string[],
  ) {
    return this.postService.search({
      key,
      skip,
      take,
      tags: tags,
      idsNotIn: idsNotIn,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postService.findOne({ id });
  }
}
