import { type GraphQLFormattedError } from 'graphql'

interface ApiErrorModel {
  code: string
  message: string
  method: string | undefined
  path?: readonly (string | number)[] | undefined
}

export class ApiErrorFormatted {
  public readonly error: ApiErrorModel

  public constructor(graphqlError: GraphQLFormattedError) {
    this.error = {
      code: graphqlError.message,
      message: (graphqlError.extensions?.description as string) || 'Internal sever error.',
      method: graphqlError.extensions?.method as string,
      path: graphqlError.path,
    }
  }
}

export * from './Common'
export * from './Authorization'
