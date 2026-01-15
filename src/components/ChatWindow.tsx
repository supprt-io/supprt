import type { JSX } from 'preact'
import { useFocusTrap } from '../hooks/useFocusTrap'
import type { ConnectionStatus, UploadProgress } from '../hooks/useWidget'
import { useTranslation } from '../i18n'
import type { Conversation, Message, Project } from '../types'
import { Branding } from './Branding'
import { ChatHeader } from './ChatHeader'
import { ConversationClosed } from './ConversationClosed'
import { ConversationList } from './ConversationList'
import { MessageInput } from './MessageInput'
import { MessageList } from './MessageList'

interface ChatWindowProps {
  isOpen: boolean
  isLoading: boolean
  error: string | null
  project: Project | null
  messages: Message[]
  activeConversation: Conversation | null
  conversations: Conversation[]
  isSending: boolean
  isComposing: boolean
  isAgentTyping: boolean
  uploadProgress: UploadProgress | null
  connectionStatus: ConnectionStatus
  queuedMessagesCount: number
  hasMoreMessages: boolean
  isLoadingMore: boolean
  primaryColor: string
  position: 'bottom-right' | 'bottom-left'
  onSendMessage: (message: string, files?: File[]) => void
  onDownloadAttachment: (attachmentId: string) => Promise<string>
  onClose: () => void
  onSelectConversation: (conversation: Conversation) => void
  onNewConversation: () => void
  onBackToList: () => void
  onClearError: () => void
  onLoadMore: () => void
}

export function ChatWindow({
  isOpen,
  isLoading,
  error,
  project,
  messages,
  activeConversation,
  conversations,
  isSending,
  isComposing,
  isAgentTyping,
  uploadProgress,
  connectionStatus,
  queuedMessagesCount,
  hasMoreMessages,
  isLoadingMore,
  primaryColor,
  position,
  onSendMessage,
  onDownloadAttachment,
  onClose,
  onSelectConversation,
  onNewConversation,
  onBackToList,
  onClearError,
  onLoadMore,
}: ChatWindowProps): JSX.Element | null {
  const t = useTranslation()
  const focusTrapRef = useFocusTrap(isOpen, onClose)

  if (!isOpen) return null

  const showConversationList = !activeConversation && !isComposing && conversations.length > 0
  const showBackButton = activeConversation || (isComposing && conversations.length > 0)
  const isConversationClosed = activeConversation?.status === 'closed'

  return (
    <div
      ref={focusTrapRef}
      class={`supprt-window ${position === 'bottom-left' ? 'supprt-window--left' : ''}`}
      aria-label={project?.name || t.support}
    >
      {connectionStatus === 'offline' && (
        // biome-ignore lint/a11y/useSemanticElements: output not appropriate for status banner
        <div class="supprt-connection-banner supprt-connection-banner--offline" role="status">
          <span>
            {t.offline}
            {queuedMessagesCount > 0 && ` · ${queuedMessagesCount} ${t.messagesQueued}`}
          </span>
        </div>
      )}
      {connectionStatus === 'reconnecting' && (
        // biome-ignore lint/a11y/useSemanticElements: output not appropriate for status banner
        <div class="supprt-connection-banner supprt-connection-banner--reconnecting" role="status">
          <div class="supprt-spinner supprt-spinner--small" />
          <span>{t.reconnecting}</span>
        </div>
      )}
      {connectionStatus === 'disconnected' && (
        <div class="supprt-connection-banner supprt-connection-banner--disconnected" role="alert">
          <span>{t.disconnected}</span>
        </div>
      )}
      {error && (
        <div class="supprt-error-banner" role="alert">
          <span class="supprt-error-banner__message">{error}</span>
          <button
            type="button"
            class="supprt-error-banner__close"
            onClick={onClearError}
            aria-label={t.dismiss}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <title>{t.dismiss}</title>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      <ChatHeader
        title={project?.name || t.support}
        primaryColor={primaryColor}
        showBackButton={!!showBackButton}
        onBack={onBackToList}
        onClose={onClose}
      />

      <div class="supprt-body">
        {showConversationList ? (
          <ConversationList
            conversations={conversations}
            primaryColor={primaryColor}
            onSelectConversation={onSelectConversation}
            onNewConversation={onNewConversation}
          />
        ) : (
          <>
            <MessageList
              messages={messages}
              welcomeMessage={project?.welcomeMessage}
              agentName={project?.agentName}
              isLoading={isLoading}
              isAgentTyping={isAgentTyping}
              primaryColor={primaryColor}
              hasMoreMessages={hasMoreMessages}
              isLoadingMore={isLoadingMore}
              onDownloadAttachment={onDownloadAttachment}
              onLoadMore={onLoadMore}
            />
            {isConversationClosed ? (
              <ConversationClosed
                primaryColor={primaryColor}
                onNewConversation={onNewConversation}
              />
            ) : (
              <MessageInput
                onSend={onSendMessage}
                isSending={isSending}
                uploadProgress={uploadProgress}
                primaryColor={primaryColor}
              />
            )}
          </>
        )}
      </div>

      <Branding />
    </div>
  )
}
