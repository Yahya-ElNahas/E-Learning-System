import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 5000;
  app.use(cookieParser());
  
  app.enableCors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type',
  });
  await app.listen(port);
  Logger.log(`Server is running on port: ${port}`);
}

bootstrap();
