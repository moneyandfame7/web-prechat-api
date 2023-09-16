import { GraphQLScalarType } from 'graphql'

export const InputPeerTest = new GraphQLScalarType({
  name: 'InputPeer',
  description: 'Input peer - (chatId) or (userId)',
  serialize() {
    throw new Error('InputPeer is an input type.')
  },
  parseValue(value: { chatId: string } | { userId: string }) {
    if ('chatId' in value) {
      return value
    } else if ('userId' in value) {
      return value
    }
  },
  parseLiteral() {
    throw new Error('UploadOrString.parseLiteral not implemented')
  },
})
