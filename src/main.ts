import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new AllExceptionsFilter());
    const listenPort = process.env.PORT ?? 3000;
    await app.listen(listenPort);
    logger.log(`App starts running on port ${listenPort}`);
  } catch (error) {
    logger.error('Failed to start the application', error);
    process.exit(1);
  }
}
bootstrap();
