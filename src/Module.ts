import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { GraphQLModule } from '@nestjs/graphql'
import type { Provider } from '@nestjs/common'
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigModule } from '@nestjs/config'
import { DateTimeResolver, GraphQLJSON, UUIDResolver } from 'graphql-scalars'
import { GraphQLUpload } from 'graphql-upload'

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'

import { AuthModule, AuthService } from './Auth'
import { UserModule } from './Users'
import { ChatsModule } from './Chats'
import { SessionsModule } from './Sessions'
import { MediaModule } from './Media'
import { MessagesModule } from './Messages'
import { ContactsModule } from './Contacts'

import { FirebaseModule } from 'common/Firebase'
import { PubSubModule } from 'common/pubSub/Module'
import { PrismaService } from 'common/prisma.service'

import { ApiErrorFormatted } from 'common/errors'

/** App  */
import { SearchModule } from 'Search/Module'
import { AccountModule } from 'Account/Module'
import { LangPackModule } from 'LangPack/Module'

import { AppResolver } from './Resolver'

const MAIN_MODULES = [
  // ApiModule,
  AuthModule,
  PubSubModule,
  UserModule,
  SearchModule,
  MessagesModule,
  ChatsModule,
  ContactsModule,
  SessionsModule,
  FirebaseModule,
  MediaModule,
  AccountModule,
  LangPackModule,
]
const CONFIG_MODULES = [
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  GraphQLModule.forRootAsync<ApolloDriverConfig>({
    driver: ApolloDriver,
    imports: [AuthModule],
    inject: [AuthService],

    useFactory: async (/* authService: AuthService */) => ({
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
        UUID: UUIDResolver,
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      context: ({ req, connection }: any) => (connection ? { req: connection.context } : { req }),

      subscriptions: {
        'graphql-ws': {
          path: '/graphql/subscriptions',
          onConnect: async (ctx) => {
            const headers: Record<string, unknown> = {
              ...(ctx.connectionParams?.headers as object),
            }
            console.log('graphql-ws-CONNECT')
            // const session = headers['prechat-session']
            // if (!session) {
            //   throw new UnauthorizedError('graphql.subscribe')
            // }
            // const decoded = await authService.decodeSession(session as string)
            // if (!decoded) {
            //   throw new SessionInvalidError('authGuard')
            // }

            // ;(ctx.extra as any).prechatSession = decoded
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(ctx.extra as any).headers = headers
            // /* якщо потрібно, можна і юзера знайти по айдішніку і поставити тут */
            return {
              req: {
                headers,
                // prechatSession: decoded,
              },
            }
          },
        },
        'subscriptions-transport-ws': {
          path: '/graphql/subscriptions',

          onConnect: () => {
            // eslint-disable-next-line no-console
            console.log('CONNECT')
          },
        },
      },
      formatError: (e) => {
        if (e.extensions?.code === 'BAD_USER_INPUT') {
          return e
        }
        const formatted = new ApiErrorFormatted(e)

        return {
          code: formatted.error.code,
          message: formatted.error.message,
          method: formatted.error.method,
          path: formatted.error.path,
        }
      },
    }),
  }),
]
const PROVIDERS: Provider[] = [AppResolver, PrismaService]

@Module({
  imports: [...MAIN_MODULES, ...CONFIG_MODULES],
  providers: [...PROVIDERS],
})
export class AppModule {}
