import { NestFactory } from '@nestjs/core'
import { graphqlUploadExpress } from 'graphql-upload'

import { MAX_FILE_SIZE } from 'common/constants'

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
  /**
   * 3 mb limit ???
   */
  app.use('/graphql', graphqlUploadExpress({ maxFileSize: MAX_FILE_SIZE, maxFiles: 10 }))

  const env = process.env.PORT || 8001
  await app.listen(env)
}
bootstrap()
