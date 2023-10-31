import type { PrismaMessage } from '../../interfaces/messages'

/**
 * @todo rewrite just for sort by orderId
 */
export function orderHistory(history: PrismaMessage[]) {
  return history.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })
}
