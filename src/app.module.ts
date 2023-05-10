import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigModule } from '@nestjs/config'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { DateTimeResolver } from 'graphql-scalars'

import { AuthModule } from './authorization/auth.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { MessagesModule } from './messages/messages.module'
import { AppResolver } from './app.resolver'
// import { getErrorCode } from './common/errors'
import { ConversationsModule } from './conversations/conversations.module'
import { PubSubModule } from './pubsub/pubsub.module'

@Module({
  imports: [
    PubSubModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      introspection: true,
      typePaths: ['./**/*.graphql'],
      resolvers: {
        DateTime: DateTimeResolver,
      },
      /* https://github.com/nestjs/docs.nestjs.com/issues/394#issuecomment-938814115 */
      subscriptions: {
        'graphql-ws': {
          path: '/graphql/subscriptions',
        },
        'subscriptions-transport-ws': {
          path: '/graphql/subscriptions',
        },
      },
      formatError: (e) => {
        // const formatted = getErrorCode(e.message)
        // console.log(formatted)
        // return formatted
        console.log(e)
        return e
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    MessagesModule,
    ConversationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
