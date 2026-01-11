import { MessageSquare, X } from 'lucide-preact'
import type { JSX } from 'preact'
import { useTranslation } from '../i18n'

interface ChatBubbleProps {
  onClick: () => void
  isOpen: boolean
  primaryColor: string
  position: 'bottom-right' | 'bottom-left'
  hasUnread?: boolean
}

export function ChatBubble({
  onClick,
  isOpen,
  primaryColor,
  position,
  hasUnread = false,
}: ChatBubbleProps): JSX.Element {
  const t = useTranslation()

  return (
    <button
      type="button"
      class={`supprt-bubble ${position === 'bottom-left' ? 'supprt-bubble--left' : ''}`}
      onClick={onClick}
      style={{ backgroundColor: primaryColor }}
      aria-label={isOpen ? t.ariaCloseChat : t.ariaOpenChat}
    >
      {isOpen ? <X size={24} aria-hidden="true" /> : <MessageSquare size={24} aria-hidden="true" />}
      {hasUnread && !isOpen && <span class="supprt-bubble__badge">!</span>}
    </button>
  )
}
