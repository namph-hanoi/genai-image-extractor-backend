import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const listenPort = process.env.PORT ?? 3000;
  await app.listen(listenPort);
  console.log(`App starts running on port ${listenPort}`);
}
bootstrap();
