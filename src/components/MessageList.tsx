import { Paperclip } from 'lucide-preact'
import type { JSX } from 'preact'
import { useEffect, useRef } from 'preact/hooks'
import { useTranslation } from '../i18n'
import type { Message } from '../types'

interface MessageListProps {
  messages: Message[]
  welcomeMessage?: string | null
  agentName?: string | null
  isLoading: boolean
}

export function MessageList({
  messages,
  welcomeMessage,
  agentName,
  isLoading,
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
        <div
          key={message.id}
          class={`supprt-message ${message.senderType === 'user' ? 'supprt-message--user' : 'supprt-message--agent'}`}
        >
          {message.senderType !== 'user' && (
            <div class="supprt-message__header">
              {message.senderAvatarUrl && (
                <img src={message.senderAvatarUrl} alt="" class="supprt-message__avatar" />
              )}
              {message.senderName && (
                <span class="supprt-message__sender">{message.senderName}</span>
              )}
            </div>
          )}
          <div class="supprt-message__content">{message.content}</div>
          <span class="supprt-message__time">{formatTime(message.createdAt)}</span>
          {message.attachments && message.attachments.length > 0 && (
            <div class="supprt-message__attachments">
              {message.attachments.map((att) => (
                <a
                  key={att.id}
                  href={att.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="supprt-attachment"
                >
                  <Paperclip size={16} aria-hidden="true" />
                  <span>{att.filename}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
