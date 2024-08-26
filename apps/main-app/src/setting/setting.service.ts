import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SettingDto } from './model/setting.dto';
import { ProducerService } from '@app/common/kafka/provider.service';

@Injectable()
export class SettingService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly producerService: ProducerService,
  ) {}

  async getSetting(userId: string) {
    return this.prismaService.setting.findUnique({
      where: {
        userId,
      },
    });
  }

  async upsertSetting(userId: string, data: SettingDto) {
    if (data.lang) {
      this.producerService.produce({
        topic: 'setting',
        messages: [
          {
            key: 'lang',
            value: JSON.stringify({
              lang: data.lang,
              userId,
            }),
          },
        ],
      });
    }

    return this.prismaService.setting.upsert({
      where: {
        userId,
      },
      update: data,
      create: {
        userId,
        ...data,
      },
    });
  }
}
