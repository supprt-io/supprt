import { Send } from 'lucide-preact'
import type { JSX } from 'preact'
import { useRef, useState } from 'preact/hooks'
import { useTranslation } from '../i18n'

interface MessageInputProps {
  onSend: (message: string) => void
  isSending: boolean
  primaryColor: string
}

export function MessageInput({ onSend, isSending, primaryColor }: MessageInputProps): JSX.Element {
  const t = useTranslation()
  const [message, setMessage] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    const trimmed = message.trim()
    if (trimmed && !isSending) {
      onSend(trimmed)
      setMessage('')
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form class="supprt-input" onSubmit={handleSubmit}>
      <textarea
        ref={inputRef}
        class="supprt-input__textarea"
        value={message}
        onInput={(e) => setMessage((e.target as HTMLTextAreaElement).value)}
        onKeyDown={handleKeyDown}
        placeholder={t.placeholder}
        rows={1}
        disabled={isSending}
      />
      <button
        type="submit"
        class="supprt-input__button"
        disabled={!message.trim() || isSending}
        style={{ backgroundColor: primaryColor }}
      >
        {isSending ? (
          <div class="supprt-spinner supprt-spinner--small" />
        ) : (
          <Send size={20} aria-hidden="true" />
        )}
      </button>
    </form>
  )
}
