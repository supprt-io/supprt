import { Paperclip } from 'lucide-preact'
import type { JSX } from 'preact'
import { useCallback, useRef, useState } from 'preact/hooks'
import { useFocusTrap } from '../hooks/useFocusTrap'
import type { ConnectionStatus, UploadProgress } from '../hooks/useWidget'
import { useTranslation } from '../i18n'
import type { Conversation, Message, Project } from '../types'
import { Branding } from './Branding'
import { ChatHeader } from './ChatHeader'
import { ConversationClosed } from './ConversationClosed'
import { ConversationList } from './ConversationList'
import { ErrorState } from './ErrorState'
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
  onTyping?: (isTyping: boolean) => void
  onDownloadAttachment: (attachmentId: string) => Promise<string>
  onClose: () => void
  onSelectConversation: (conversation: Conversation) => void
  onNewConversation: () => void
  onBackToList: () => void
  onLoadMore: () => void
  onRetry: () => void
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
  onTyping,
  onDownloadAttachment,
  onClose,
  onSelectConversation,
  onNewConversation,
  onBackToList,
  onLoadMore,
  onRetry,
}: ChatWindowProps): JSX.Element | null {
  const t = useTranslation()
  const focusTrapRef = useFocusTrap(isOpen, onClose)
  const windowRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [droppedFiles, setDroppedFiles] = useState<File[]>([])

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Check if we're leaving the window entirely
    const rect = windowRef.current?.getBoundingClientRect()
    if (rect) {
      const { clientX, clientY } = e
      if (
        clientX <= rect.left ||
        clientX >= rect.right ||
        clientY <= rect.top ||
        clientY >= rect.bottom
      ) {
        setIsDragging(false)
      }
    }
  }, [])

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer?.files
    if (!files || files.length === 0) return

    setDroppedFiles(Array.from(files))
  }, [])

  const handleExternalFilesProcessed = useCallback(() => {
    setDroppedFiles([])
  }, [])

  if (!isOpen) return null

  const showConversationList = !activeConversation && !isComposing && conversations.length > 0
  const showBackButton = activeConversation || (isComposing && conversations.length > 0)
  const isConversationClosed = activeConversation?.status === 'closed'

  // Combine refs
  const setRefs = (el: HTMLDivElement | null) => {
    windowRef.current = el
    // focusTrapRef is a ref object from useFocusTrap
    ;(focusTrapRef as { current: HTMLDivElement | null }).current = el
  }

  return (
    // biome-ignore lint/a11y/useSemanticElements: div required for styling and ref attachment
    <div
      ref={setRefs}
      class={`supprt-window ${position === 'bottom-left' ? 'supprt-window--left' : ''} ${isDragging ? 'supprt-window--dragging' : ''}`}
      role="region"
      aria-label={project?.name || t.support}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div class="supprt-window__drop-overlay">
          <div class="supprt-window__drop-icon" style={{ backgroundColor: `${primaryColor}15` }}>
            <Paperclip size={36} style={{ color: primaryColor }} />
          </div>
          <span class="supprt-window__drop-text" style={{ color: primaryColor }}>
            Drop files here
          </span>
          <span class="supprt-window__drop-hint">Files will be attached to your message</span>
        </div>
      )}
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
      <ChatHeader
        title={project?.name || t.support}
        primaryColor={primaryColor}
        showBackButton={!!showBackButton}
        onBack={onBackToList}
        onClose={onClose}
      />

      <div class="supprt-body">
        {error ? (
          <ErrorState onRetry={onRetry} primaryColor={primaryColor} />
        ) : showConversationList ? (
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
                onTyping={onTyping}
                isSending={isSending}
                uploadProgress={uploadProgress}
                primaryColor={primaryColor}
                externalFiles={droppedFiles}
                onExternalFilesProcessed={handleExternalFilesProcessed}
              />
            )}
          </>
        )}
      </div>

      <Branding />
    </div>
  )
}
