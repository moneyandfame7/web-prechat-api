import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { graphqlUploadExpress } from 'graphql-upload'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  })
  app.use('/graphql', graphqlUploadExpress({ maxFileSize: 100 * 1024 * 1024, maxFiles: 10 }))

  const env = process.env.PORT || 8001
  await app.listen(env)
}
bootstrap()
