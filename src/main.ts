import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    const app = await NestFactory.create(AppModule);
    // Enable CORS
    const allowedHosts = process.env.ALLOW_HOSTS
      ? JSON.parse(process.env.ALLOW_HOSTS)
      : [process.env.DOMAIN];
    app.enableCors({
      origin: allowedHosts,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });
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
