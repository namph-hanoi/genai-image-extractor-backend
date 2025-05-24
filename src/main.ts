import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    const app = await NestFactory.create(AppModule);
    const listenPort = process.env.PORT ?? 3000;
    await app.listen(listenPort);
    logger.log(`App starts running on port ${listenPort}`);
  } catch (error) {
    logger.error('Failed to start the application', error);
    process.exit(1);
  }
}
bootstrap();
