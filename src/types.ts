import type { SupportedLocale } from './i18n'

export interface SupprtConfig {
  publicKey: string
  user?: {
    id: string
    email?: string
    name?: string
    avatar?: string
  }
  locale?: SupportedLocale
  position?: 'bottom-right' | 'bottom-left'
  primaryColor?: string
  zIndex?: number
}

export interface EndUser {
  id: string
  name?: string | null
  email?: string | null
  avatarUrl?: string | null
}

export interface Project {
  id: string
  name: string
  agentName?: string | null
  welcomeMessage?: string | null
  locale?: string | null
  primaryColor?: string | null
  position?: string | null
}

export interface Message {
  id: string
  content: string
  senderType: 'user' | 'agent' | 'bot'
  senderName?: string
  senderAvatarUrl?: string
  createdAt: string
  attachments?: Attachment[]
}

export interface Attachment {
  id: string
  filename: string
  contentType: string
  size: number
}

export interface Conversation {
  id: string
  status: 'open' | 'closed'
  lastMessage?: Message | null
  createdAt: string
  updatedAt: string
}

export interface InitResponse {
  token: string
  endUser: EndUser
  project: Project
  conversations: Conversation[]
}

export interface WidgetState {
  isOpen: boolean
  isLoading: boolean
  isInitialized: boolean
  error: string | null
  token: string | null
  endUser: EndUser | null
  project: Project | null
  conversations: Conversation[]
  activeConversation: Conversation | null
  messages: Message[]
  isSending: boolean
}
