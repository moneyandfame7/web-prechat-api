import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { APP_GUARD } from '@nestjs/core'
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigModule } from '@nestjs/config'
import { DateTimeResolver, GraphQLJSON } from 'graphql-scalars'
import { GraphQLUpload } from 'graphql-upload'

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'

import { AuthModule, AuthService } from './Auth'
import { UserModule } from './Users'
import { ChatsModule } from './Chats'
import { PubSubModule } from './PubSub'
import { SessionsModule } from './Sessions'
import { TranslationModule } from './Translation'
import { MediaModule } from './Media'
import { MessagesModule } from './Messages'
import { FirebaseModule } from './Firebase'
import { ApiModule, ApiGuard } from './Api'

import { ApiErrorFormatted, type ErrorCode } from 'common/errors'
import { PrismaService } from 'prisma.service'

/** App  */
import { AppResolver } from './Resolver'
import { AppService } from './Service'

const MAIN_MODULES = [
  ApiModule,
  AuthModule,
  PubSubModule,
  UserModule,
  MessagesModule,
  ChatsModule,
  SessionsModule,
  FirebaseModule,
  TranslationModule,
  MediaModule,
]
const CONFIG_MODULES = [
  ConfigModule.forRoot({
    isGlobal: true,
  }),
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
      // context: ({ req, connection }: any) => (connection ? { req: connection.context } : { req }),
      context: (context: any) => {
        if (context?.extra?.request) {
          return {
            req: {
              ...context?.extra?.request,
              headers: {
                ...context?.extra?.request?.headers,
                ...context?.connectionParams,
              },
            },
          }
        }

        return { req: context?.req }
      },
      subscriptions: {
        'graphql-ws': {
          path: '/graphql/subscriptions',
          onConnect: (ctx) => {
            const headers: Record<string, unknown> = {
              ...(ctx.connectionParams?.headers as object),
            }
            console.log('graphql-ws-CONNECT')
            if ('sessionId' in headers && typeof headers.sessionId === 'string') {
              /* do smth */
            }

            return {
              req: {
                headers,
              },
            }
          },
        },
        // 'subscriptions-transport-ws': {
        //   path: '/graphql/subscriptions',
        //   onConnect: (connection: Record<string, any>) => {
        //     console.log('graphql-transport-ws-CONNECT')

        //     console.log({ connection })
        //     return {
        //       req: {
        //         headers: {
        //           ...connection,
        //         },
        //       },
        //     }
        //   },
        // },
      },
      // context: ({ req, connection }) => (connection ? { req: connection.context } : { req }),
      formatError: (e) => {
        const formatted = new ApiErrorFormatted(e.message as ErrorCode)
        if (formatted.message) {
          return { code: formatted.code, message: formatted.message }
        }
        return e
      },
    }),
  }),
]
const PROVIDERS = [
  AppService,
  AppResolver,
  PrismaService,
  {
    provide: APP_GUARD,
    useClass: ApiGuard,
  },
]

@Module({
  imports: [...MAIN_MODULES, ...CONFIG_MODULES],
  providers: [...PROVIDERS],
})
export class AppModule {}
