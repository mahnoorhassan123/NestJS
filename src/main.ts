import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'], 
  });

  const logger = new Logger('Bootstrap');

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API documentation for user')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.use(cookieParser());

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  logger.log(`Server is running on http://localhost:${port}`);
  logger.log(`Swagger docs available at http://localhost:${port}/api-docs`);
}

bootstrap();
