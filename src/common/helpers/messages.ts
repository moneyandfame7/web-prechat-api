import type { PrismaMessage } from '../../types/Messages'

/**
 * @todo rewrite just for sort by orderId
 */
export function orderHistory(history: PrismaMessage[]) {
  return history.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })
}
