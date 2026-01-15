export type SupportedLocale = 'en' | 'fr' | 'es' | 'de'

export interface Translations {
  // Chat window
  support: string
  you: string
  newConversation: string
  noMessages: string
  resolved: string
  conversationResolved: string
  startNewConversation: string
  poweredBy: string

  // Aria labels
  ariaOpenChat: string
  ariaCloseChat: string
  ariaBackToConversations: string

  // Input
  placeholder: string

  // Dates
  yesterday: string

  // Errors
  failedToInitialize: string
  failedToLoadMessages: string
  failedToSendMessage: string

  // Actions
  dismiss: string

  // Image lightbox
  viewImage: string
  imagePreview: string
  closeImage: string

  // Connection status
  reconnecting: string
  disconnected: string
  offline: string
  messagesQueued: string
}
