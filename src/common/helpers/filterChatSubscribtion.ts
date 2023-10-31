import type { PrismaChatFull } from '../../types/Chats'

export function filterChatSubscription(requesterId: string, chatFull: PrismaChatFull) {
  const affectedUsers = chatFull?.members.map((member) => ({ ...member.user }))

  return Boolean(affectedUsers?.find((user) => user.id === requesterId))
}
