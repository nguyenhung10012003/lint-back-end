import { PutObjectCommandInput, S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Injectable } from '@nestjs/common';
import { getMediaType } from '../utils/media-type';

@Injectable()
export class AwsS3Service {
  private readonly s3: S3;
  constructor() {
    this.s3 = new S3({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },

      region: process.env.AWS_REGION || '',
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const params: PutObjectCommandInput = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `media/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    const data = await new Upload({
      client: this.s3,
      params,
    }).done();
    return {
      url: data.Location as string,
      type: getMediaType(file.mimetype),
    };
  }

  async uploadFiles(files: Express.Multer.File[]) {
    return Promise.all(
      files.map(async (file) => {
        return this.uploadFile(file);
      }),
    );
  }

  async deleteFile(fileUrl: string): Promise<void> {
    return;
  }
}
