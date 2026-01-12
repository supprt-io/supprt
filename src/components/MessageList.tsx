import type { JSX } from 'preact'
import { useEffect, useRef } from 'preact/hooks'
import { useTranslation } from '../i18n'
import type { Message } from '../types'
import { formatTime } from '../utils/date'
import { AttachmentItem } from './AttachmentItem'

interface MessageListProps {
  messages: Message[]
  welcomeMessage?: string | null
  agentName?: string | null
  isLoading: boolean
  onDownloadAttachment?: (attachmentId: string) => Promise<string>
}

export function MessageList({
  messages,
  welcomeMessage,
  agentName,
  isLoading,
  onDownloadAttachment,
}: MessageListProps): JSX.Element {
  const t = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)

  const messagesLength = messages.length
  // biome-ignore lint/correctness/useExhaustiveDependencies: We want to scroll when messages count changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messagesLength])

  if (isLoading) {
    return (
      <div class="supprt-messages supprt-messages--loading">
        <div class="supprt-spinner" />
      </div>
    )
  }

  return (
    <div class="supprt-messages" ref={containerRef}>
      {welcomeMessage && (
        <div class="supprt-message supprt-message--agent">
          <span class="supprt-message__sender">{agentName || t.support}</span>
          <div class="supprt-message__content">{welcomeMessage}</div>
        </div>
      )}

      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          onDownloadAttachment={onDownloadAttachment}
        />
      ))}
    </div>
  )
}

interface MessageBubbleProps {
  message: Message
  onDownloadAttachment?: (attachmentId: string) => Promise<string>
}

function MessageBubble({ message, onDownloadAttachment }: MessageBubbleProps): JSX.Element {
  const isUser = message.senderType === 'user'
  const hasAttachments = message.attachments && message.attachments.length > 0

  return (
    <div class={`supprt-message ${isUser ? 'supprt-message--user' : 'supprt-message--agent'}`}>
      {!isUser && (
        <div class="supprt-message__header">
          {message.senderAvatarUrl && (
            <img src={message.senderAvatarUrl} alt="" class="supprt-message__avatar" />
          )}
          {message.senderName && <span class="supprt-message__sender">{message.senderName}</span>}
        </div>
      )}
      <div class="supprt-message__content">{message.content}</div>
      <span class="supprt-message__time">{formatTime(message.createdAt)}</span>
      {hasAttachments && (
        <div class="supprt-message__attachments">
          {message.attachments!.map((att) => (
            <AttachmentItem key={att.id} attachment={att} onDownload={onDownloadAttachment} />
          ))}
        </div>
      )}
    </div>
  )
}
