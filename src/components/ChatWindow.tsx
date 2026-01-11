import { ChevronLeft, Plus, X } from 'lucide-preact'
import type { JSX } from 'preact'
import { useTranslation } from '../i18n'
import type { Conversation, Message, Project } from '../types'
import { MessageInput } from './MessageInput'
import { MessageList } from './MessageList'

interface ChatWindowProps {
  isOpen: boolean
  isLoading: boolean
  project: Project | null
  messages: Message[]
  activeConversation: Conversation | null
  conversations: Conversation[]
  isSending: boolean
  isComposing: boolean
  primaryColor: string
  position: 'bottom-right' | 'bottom-left'
  onSendMessage: (message: string) => void
  onClose: () => void
  onSelectConversation: (conversation: Conversation) => void
  onNewConversation: () => void
  onBackToList: () => void
}

export function ChatWindow({
  isOpen,
  isLoading,
  project,
  messages,
  activeConversation,
  conversations,
  isSending,
  isComposing,
  primaryColor,
  position,
  onSendMessage,
  onClose,
  onSelectConversation,
  onNewConversation,
  onBackToList,
}: ChatWindowProps): JSX.Element | null {
  const t = useTranslation()

  if (!isOpen) return null

  const showConversationList = !activeConversation && !isComposing && conversations.length > 0
  const showBackButton = activeConversation || (isComposing && conversations.length > 0)

  return (
    <div class={`supprt-window ${position === 'bottom-left' ? 'supprt-window--left' : ''}`}>
      <header class="supprt-header" style={{ backgroundColor: primaryColor }}>
        <div class="supprt-header__content">
          {showBackButton && (
            <button
              type="button"
              class="supprt-header__back"
              onClick={onBackToList}
              aria-label={t.ariaBackToConversations}
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
          )}
          <h2 class="supprt-header__title">{project?.name || t.support}</h2>
        </div>
        <button
          type="button"
          class="supprt-header__close"
          onClick={onClose}
          aria-label={t.ariaCloseChat}
        >
          <X size={20} aria-hidden="true" />
        </button>
      </header>

      <div class="supprt-body">
        {showConversationList ? (
          <div class="supprt-conversations">
            <button
              type="button"
              class="supprt-new-conversation"
              onClick={onNewConversation}
              style={{ color: primaryColor }}
            >
              <Plus size={20} aria-hidden="true" />
              <span>{t.newConversation}</span>
            </button>

            <div class="supprt-conversations__list">
              {conversations.map((conv) => (
                <button
                  type="button"
                  key={conv.id}
                  class={`supprt-conversation-item ${conv.status === 'closed' ? 'supprt-conversation-item--closed' : ''}`}
                  onClick={() => onSelectConversation(conv)}
                >
                  <div class="supprt-conversation-item__content">
                    <span class="supprt-conversation-item__preview">
                      {conv.lastMessage?.content || t.noMessages}
                    </span>
                    <div class="supprt-conversation-item__meta">
                      {conv.status === 'closed' && (
                        <span class="supprt-conversation-item__badge">{t.resolved}</span>
                      )}
                      <span class="supprt-conversation-item__time">
                        {formatDate(conv.updatedAt, t.yesterday)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <MessageList
              messages={messages}
              welcomeMessage={project?.welcomeMessage}
              agentName={project?.agentName}
              isLoading={isLoading}
            />
            {activeConversation?.status === 'closed' ? (
              <div class="supprt-closed">
                <div class="supprt-closed__icon">✓</div>
                <p class="supprt-closed__text">{t.conversationResolved}</p>
                <button
                  type="button"
                  class="supprt-closed__button"
                  onClick={onNewConversation}
                  style={{ backgroundColor: primaryColor }}
                >
                  {t.startNewConversation}
                </button>
              </div>
            ) : (
              <MessageInput
                onSend={onSendMessage}
                isSending={isSending}
                primaryColor={primaryColor}
              />
            )}
          </>
        )}
      </div>
      <footer class="supprt-branding">
        <a
          href="https://supprt.dev"
          target="_blank"
          rel="noopener noreferrer"
          class="supprt-branding__link"
        >
          {t.poweredBy} <strong>Supprt</strong>
        </a>
      </footer>
    </div>
  )
}

function formatDate(dateString: string, yesterday: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  if (diffDays === 1) {
    return yesterday
  }
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' })
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}
