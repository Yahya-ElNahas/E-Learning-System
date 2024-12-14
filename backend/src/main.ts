import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',  
    methods: 'GET,POST,PUT,DELETE',  
    allowedHeaders: 'Content-Type, Authorization',  
  });
  const port = process.env.PORT ?? 8000
  app.use(cookieParser());
  await app.listen(port);
  Logger.log(`Server is running on port: http://localhost:${port}`);
}

bootstrap();
