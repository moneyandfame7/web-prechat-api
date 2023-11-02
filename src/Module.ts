import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { GraphQLModule } from '@nestjs/graphql'
import { type OnModuleInit, type Provider } from '@nestjs/common'
// import { CacheModule } from '@nestjs/cache-manager'
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { DateTimeResolver, GraphQLJSON, UUIDResolver } from 'graphql-scalars'

import { GraphQLUpload } from 'graphql-upload'
// import * as redisStore from 'cache-manager-redis-store'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'

import { AuthModule, AuthService } from './Auth'
import { UserModule } from './Users'
import { ChatsModule } from './Chats'
import { SessionsModule } from './Sessions'
import { MediaModule } from './Media'
import { MessagesModule } from './Messages'
import { ContactsModule } from './Contacts'

import { FirebaseModule } from 'common/Firebase'
import { PrismaService } from 'common/prisma.service'
import { PubSub2Module } from 'common/pubSub/Module'

import { ApiErrorFormatted } from 'common/errors'

/** App  */
import { AccountModule } from 'Account/Module'
import { LangPackModule } from 'LangPack/Module'

import { AppResolver } from './Resolver'

const MAIN_MODULES = [
  // ApiModule,
  AuthModule,
  UserModule,
  MessagesModule,
  ChatsModule,
  ContactsModule,
  SessionsModule,
  FirebaseModule,
  MediaModule,
  AccountModule,
  LangPackModule,
  // Wrappers for libs
  PubSub2Module,
]
const CONFIG_MODULES = [
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  GraphQLModule.forRootAsync<ApolloDriverConfig>({
    driver: ApolloDriver,
    inject: [ConfigService],

    useFactory: async (configService: ConfigService) => ({
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      introspection: true,
      typePaths: ['./**/*.graphql'],
      cors: {
        credentials: true,
        origin: configService.get('CLIENT_URL'),
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(ctx.extra as any).headers = headers
            return {
              req: {
                headers,
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

  // CacheModule.registerAsync({
  //   isGlobal: true,
  //   imports: [ConfigModule],
  //   inject: [ConfigService],
  //   useFactory: async (config: ConfigService) => ({
  //     store: redisStore,
  //     url: config.get('REDIS_URL'),
  //     no_ready_check: true, // new property

  //     ttl: 60,
  //     tls: true,
  //   }),
  // }),
]
const PROVIDERS: Provider[] = [
  AppResolver,
  PrismaService,
  // {
  //   provide: APP_GUARD,
  //   useClass: AuthGuard,
  // },
]

@Module({
  imports: [...MAIN_MODULES, ...CONFIG_MODULES],
  providers: [...PROVIDERS],
})
export class AppModule implements OnModuleInit {
  /* DATABASE FOR SCHEDULE MESSAGES, DATE ON IT SENDING!!! INIT HERE. */
  /** get cron jobs, check names etc.. */
  public onModuleInit() {
    // eslint-disable-next-line no-console
    console.log('APP MODULE INITIALIZE')
  }
}
