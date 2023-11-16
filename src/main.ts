import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'

import { graphqlUploadExpress } from 'graphql-upload'

import { MAX_FILE_SIZE } from 'common/constants'
import type { AppEnvironmentConfig } from 'interfaces/app'

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

  const config = app.get<ConfigService<AppEnvironmentConfig>>(ConfigService)

  app.enableCors({
    origin: config.getOrThrow('CLIENT_URL'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  })

  // app.use((req: any, res: any, next: any) => {
  //   res.header('Access-Control-Allow-Origin', '*') // Set to your specific origin in production
  //   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  //   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  //   next()
  // })
  /**
   * 3 mb limit ???
   */
  app.use('/graphql', graphqlUploadExpress({ maxFileSize: MAX_FILE_SIZE, maxFiles: 10 }))

  const env = process.env.PORT || 8001
  await app.listen(env)
}
bootstrap()
