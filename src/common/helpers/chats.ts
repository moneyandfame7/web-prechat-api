export function isUserId(chatId: string) {
  return chatId.startsWith('u_')
}

export function isChatId(chatId: string) {
  return chatId.startsWith('c_')
}

export function isSavedMessages(requesterId: string, peerId: string) {
  return isUserId(peerId) && requesterId === peerId
}
