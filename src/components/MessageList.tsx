import type { JSX } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import { useTranslation } from '../i18n'
import type { Message } from '../types'
import { formatTime } from '../utils/date'
import { Markdown } from '../utils/markdown'
import { AttachmentItem } from './AttachmentItem'
import { ImagePreview } from './ImagePreview'
import { TypingIndicator } from './TypingIndicator'

interface MessageListProps {
  messages: Message[]
  welcomeMessage?: string | null
  agentName?: string | null
  isLoading: boolean
  isAgentTyping?: boolean
  primaryColor?: string
  onDownloadAttachment?: (attachmentId: string) => Promise<string>
}

export function MessageList({
  messages,
  welcomeMessage,
  agentName,
  isLoading,
  isAgentTyping = false,
  primaryColor = '#04b3a4',
  onDownloadAttachment,
}: MessageListProps): JSX.Element {
  const t = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)

  const messagesLength = messages.length
  // biome-ignore lint/correctness/useExhaustiveDependencies: We want to scroll when messages count changes or typing state changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messagesLength, isAgentTyping])

  if (isLoading) {
    return (
      <div class="supprt-messages supprt-messages--loading" aria-busy="true">
        <div class="supprt-spinner" role="status" aria-label="Loading messages" />
      </div>
    )
  }

  return (
    <div
      class="supprt-messages"
      ref={containerRef}
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
    >
      {welcomeMessage && (
        <div class="supprt-message supprt-message--agent">
          <span class="supprt-message__sender">{agentName || t.support}</span>
          <div class="supprt-message__content">
            <Markdown content={welcomeMessage} />
          </div>
        </div>
      )}

      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          primaryColor={primaryColor}
          onDownloadAttachment={onDownloadAttachment}
        />
      ))}

      {isAgentTyping && (
        <TypingIndicator primaryColor={primaryColor} agentName={agentName || undefined} />
      )}
    </div>
  )
}

interface MessageBubbleProps {
  message: Message
  primaryColor: string
  onDownloadAttachment?: (attachmentId: string) => Promise<string>
}

function MessageBubble({
  message,
  primaryColor,
  onDownloadAttachment,
}: MessageBubbleProps): JSX.Element {
  const t = useTranslation()
  const isUser = message.senderType === 'user'

  // Separate image attachments from other files
  const imageAttachments =
    message.attachments?.filter((att) => att.contentType.startsWith('image/')) || []
  const fileAttachments =
    message.attachments?.filter((att) => !att.contentType.startsWith('image/')) || []

  return (
    <div class={`supprt-message ${isUser ? 'supprt-message--user' : 'supprt-message--agent'}`}>
      {isUser ? (
        <span class="supprt-message__sender supprt-message__sender--user">{t.you}</span>
      ) : (
        <div class="supprt-message__header">
          {message.senderAvatarUrl && (
            <img src={message.senderAvatarUrl} alt="" class="supprt-message__avatar" />
          )}
          {message.senderName && <span class="supprt-message__sender">{message.senderName}</span>}
        </div>
      )}
      {message.content && (
        <div
          class="supprt-message__content"
          style={isUser ? { backgroundColor: primaryColor } : undefined}
        >
          <Markdown content={message.content} />
        </div>
      )}

      {/* Image attachments displayed as inline previews */}
      {imageAttachments.length > 0 && (
        <div class="supprt-message__images">
          {imageAttachments.map((att) => (
            <ImageAttachment key={att.id} attachment={att} onDownload={onDownloadAttachment} />
          ))}
        </div>
      )}

      <time class="supprt-message__time" dateTime={message.createdAt}>
        {formatTime(message.createdAt)}
      </time>

      {/* File attachments displayed as download links */}
      {fileAttachments.length > 0 && (
        <div class="supprt-message__attachments">
          {fileAttachments.map((att) => (
            <AttachmentItem key={att.id} attachment={att} onDownload={onDownloadAttachment} />
          ))}
        </div>
      )}
    </div>
  )
}

interface ImageAttachmentProps {
  attachment: { id: string; filename: string; contentType: string }
  onDownload?: (attachmentId: string) => Promise<string>
}

function ImageAttachment({ attachment, onDownload }: ImageAttachmentProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (onDownload) {
      onDownload(attachment.id)
        .then((url) => {
          setImageUrl(url)
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    }
  }, [attachment.id, onDownload])

  if (loading) {
    return <div class="supprt-image-preview supprt-image-preview--loading" />
  }

  if (!imageUrl) {
    return <AttachmentItem attachment={attachment as any} onDownload={onDownload} />
  }

  return <ImagePreview src={imageUrl} alt={attachment.filename} />
}
