import { AccessTokenGuard } from '@app/common/guards';
import { ErrorInterceptor } from '@app/common/interceptors/error.interceptor';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsS3Service } from '../s3/aws-s3.service';
import { imageAcceptReg } from '../utils/media-accept';
import { ProfileDto } from './model/profile.model';
import { ProfileService } from './profile.service';

@Controller('profile')
@UseGuards(AccessTokenGuard)
@UseInterceptors(ErrorInterceptor)
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly s3Service: AwsS3Service,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  async create(
    @Req() req,
    @Body() createProfileDto: ProfileDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: imageAcceptReg,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    file?: Express.Multer.File,
  ) {
    return this.profileService.create({
      ...createProfileDto,
      avatar: file && (await this.s3Service.uploadFile(file))?.url,
      userId: req.user.userId,
    });
  }

  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(id);
  }

  @Patch()
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter: (req, file, cb) => {
        if (!file) {
          cb(null, false);
        } else {
          if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            return cb(
              new BadRequestException('Only image files are allowed!'),
              false,
            );
          }
          cb(null, true);
        }
      },
    }),
  )
  async update(
    @Req() req: any,
    @Body() updateProfileDto: ProfileDto,
    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    const media = file && (await this.s3Service.uploadFile(file));
    return this.profileService.update({
      where: {
        userId: req.user.userId,
      },
      data: {
        name: updateProfileDto.name,
        alias: updateProfileDto.alias,
        bio: updateProfileDto.bio,
        country: updateProfileDto.country,
        dob: updateProfileDto.dob,
        avatar: media?.url,
        gender: updateProfileDto.gender,
      },
    });
  }
}
