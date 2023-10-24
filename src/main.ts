import { NestFactory } from '@nestjs/core'
import { graphqlUploadExpress } from 'graphql-upload'

import { AppModule } from './Module'

/**
 * @todo messages.searchGlobal ( filter - Media, Files, Links, Voice, Common
 * Groups )
 * @todo chats.toggleMute() // ???
 * @todo getHasPermissions(...)
 * @todo discussions
 *
 * Message - Discussion
 *
 * Discussion:
 * message Message relation name DiscussionForMessage
 * messageId String ( id/orderId? ???)
 *
 * comments Message[] relation name DiscussionComments
 */
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
