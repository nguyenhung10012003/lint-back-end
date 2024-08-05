import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.enableCors(
    process.env.NODE_ENV === 'development'
      ? {
          origin: '*',
          methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
          allowedHeaders: 'Content-Type, Accept, Authorization',
        }
      : {
          origin: [
            'http://localhost:3000',
            'https://api-gateway-8b3e1.web.app',
          ],
          methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
          allowedHeaders: 'Content-Type, Accept, Authorization',
          credentials: true,
        },
  );
  await app.listen(8000);
}
bootstrap();
