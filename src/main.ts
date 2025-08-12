import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  console.log('Starting NestJS app...'); 
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.use(cookieParser());
  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  console.log(`Server is running on http://localhost:${port}`);
}
bootstrap();
