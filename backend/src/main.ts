/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // Cast app to NestExpressApplication
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: ['http://localhost:5000', 'http://192.168.1.177:5000'],
    methods: 'GET,POST,PATCH,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  const port = process.env.PORT ?? 8000;
  app.use(cookieParser());

  // Use static assets
  app.useStaticAssets(join(__dirname, '..', 'uploads'));

  await app.listen(port);

  Logger.log(`Server is running on port: http://localhost:${port}`);
}

bootstrap();