import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const kafkaUrl = process.env.KAFKA_URL;
  if (!kafkaUrl) {
    throw new Error('KAFKA_URL environment variable is not defined.');
  }

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [kafkaUrl],
      },
      consumer: {
        groupId: 'notification-consumer',
      },
    },
  });
  await app.startAllMicroservices();

  await app.listen(8001);
}
bootstrap();
