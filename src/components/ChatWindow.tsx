import type { JSX } from 'preact'
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
  project: Project | null
  messages: Message[]
  activeConversation: Conversation | null
  conversations: Conversation[]
  isSending: boolean
  isComposing: boolean
  primaryColor: string
  position: 'bottom-right' | 'bottom-left'
  onSendMessage: (message: string, files?: File[]) => void
  onDownloadAttachment: (attachmentId: string) => Promise<string>
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
  onDownloadAttachment,
  onClose,
  onSelectConversation,
  onNewConversation,
  onBackToList,
}: ChatWindowProps): JSX.Element | null {
  const t = useTranslation()

  if (!isOpen) return null

  const showConversationList = !activeConversation && !isComposing && conversations.length > 0
  const showBackButton = activeConversation || (isComposing && conversations.length > 0)
  const isConversationClosed = activeConversation?.status === 'closed'

  return (
    <div class={`supprt-window ${position === 'bottom-left' ? 'supprt-window--left' : ''}`}>
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
              onDownloadAttachment={onDownloadAttachment}
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
