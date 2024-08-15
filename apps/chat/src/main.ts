import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  // app.useWebSocketAdapter(new GateWayAdapter(app));  
  await app.listen(8002);
}
bootstrap();
