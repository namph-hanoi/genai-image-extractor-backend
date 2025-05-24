import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const listenPort = process.env.PORT ?? 3000;
  await app.listen(listenPort);
  logger.log(`App starts running on port ${listenPort}`);
}
bootstrap();
