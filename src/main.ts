import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const env = process.env.PORT || 8001;
  await app.listen(env);
}
bootstrap();
