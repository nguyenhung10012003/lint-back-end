import { KafkaModule } from '@app/common/kafka/kafka.module';
import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';

@Module({
  imports: [KafkaModule],
  providers: [PrismaService, SettingService],
  controllers: [SettingController],
})
export class SettingModule {}
