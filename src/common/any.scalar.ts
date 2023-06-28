import { GraphQLScalarType } from 'graphql'

export const AnyScalar = new GraphQLScalarType({
  name: 'AnyScalar',
  description: 'Scalar representing any type',
  parseValue(value: any): any {
    return value // No parsing needed, return the value as-is
  },
  serialize(value: any): any {
    return value // No serialization needed, return the value as-is
  },
  parseLiteral(ast: any): any {
    return ast.value
  },
})
