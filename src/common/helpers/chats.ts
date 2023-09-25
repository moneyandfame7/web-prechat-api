export function isUserId(chatId: string) {
  return chatId.startsWith('u_')
}

export function isChatId(chatId: string) {
  return chatId.startsWith('c_')
}
