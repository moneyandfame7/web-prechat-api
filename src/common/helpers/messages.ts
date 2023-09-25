import type { PrismaMessage } from 'common/builder/messages'

export function orderHistory(history: PrismaMessage[]) {
  return history.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })
}
