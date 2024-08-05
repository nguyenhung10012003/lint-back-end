import { Module } from '@nestjs/common';
import { ProducerService } from './provider.service';

@Module({
  providers: [ProducerService],
  exports: [ProducerService],
})
export class KafkaModule {}
