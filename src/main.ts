import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });
  const env = process.env.PORT || 8001;
  await app.listen(env);
  console.log('uri:', process.env.CLIENT_URL);
}
bootstrap();
