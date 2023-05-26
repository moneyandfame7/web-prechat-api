import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig, AuthenticationError } from '@nestjs/apollo'
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
import { AuthService } from './authorization/auth.service'
import { JwtPayload } from './authorization/auth.type'
import { GqlContext } from './types/ctx'

@Module({
  imports: [
    AuthModule,
    PubSubModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    MessagesModule,
    ConversationsModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [AuthModule],
      inject: [AuthService],
      useFactory: async (authService: AuthService) => ({
        playground: false,
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        introspection: true,
        typePaths: ['./**/*.graphql'],
        resolvers: {
          DateTime: DateTimeResolver,
        },
        subscriptions: {
          'graphql-ws': {
            path: '/graphql/subscriptions',
            onConnect: (ctx) => {
              const headers: Record<string, unknown> = {
                ...(ctx.connectionParams.headers as object),
              }
              if ('authorization' in headers && typeof headers.authorization === 'string') {
                const token = headers.authorization.split(' ')[1]

                const user: JwtPayload = authService.getJwtPayload(token, authService.SECRET_ACCESS)

                ;(ctx.extra as any).user = user
              } else {
                throw new AuthenticationError('TOKEN NOT PROVIDED')
              }
            },
          },
          'subscriptions-transport-ws': {
            path: '/graphql/subscriptions',
          },
        },
        context: ({ req, connection }) => (connection ? { req: connection.context } : { req }),
        formatError: (e) => {
          console.log({ e })
          return e
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
