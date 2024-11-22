/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(port) {
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  console.log('Server is running on port: ' + port);
}
bootstrap(process.env.PORT ?? 5000);
