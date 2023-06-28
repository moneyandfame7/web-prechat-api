import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigModule } from '@nestjs/config'
import { DateTimeResolver, GraphQLJSON } from 'graphql-scalars'
import { GraphQLUpload } from 'graphql-upload'

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'

import { AuthModule } from './authorization/auth.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './users/users.module'
import { MessagesModule } from './messages/messages.module'
import { AppResolver } from './app.resolver'
import { ChatsModule } from './chats/chats.module'
import { PubSubModule } from './pubsub/pubsub.module'
import { AuthService } from './authorization/auth.service'
import { SessionsModule } from './sessions/sessions.module'
import { FirebaseModule } from './firebase/firebase.module'

import { TranslationModule } from './translation/translation.module'
import { MediaModule } from './media/media.module'

@Module({
  imports: [
    AuthModule,
    PubSubModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    MessagesModule,
    ChatsModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [AuthModule],
      inject: [AuthService],

      useFactory: async (authService: AuthService) => ({
        playground: false,
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        introspection: true,
        typePaths: ['./**/*.graphql'],
        cors: {
          credentials: true,
          origin: true,
        },
        resolvers: {
          DateTime: DateTimeResolver,
          Upload: GraphQLUpload,
          JSON: GraphQLJSON,
        },
        // context: ({ req, res, payload, connection }: any) => ({
        //   req,
        //   res,
        //   payload,
        //   connection,
        // }),
        subscriptions: {
          'graphql-ws': {
            path: '/graphql/subscriptions',
            onConnect: (ctx) => {
              const headers: Record<string, unknown> = {
                ...(ctx.connectionParams?.headers as object),
              }

              console.log(ctx)
              if ('sessionId' in headers && typeof headers.sessionId === 'string') {
                /* do smth */
              }
            },
          },
          'subscriptions-transport-ws': {
            path: '/graphql/subscriptions',
          },
        },
        // context: ({ req, connection }) => (connection ? { req: connection.context } : { req }),
        formatError: (e) => {
          console.log({ e })
          return e
        },
      }),
    }),
    SessionsModule,
    FirebaseModule,
    TranslationModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
