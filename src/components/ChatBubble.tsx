import { MessageSquare, X } from 'lucide-preact'
import type { JSX } from 'preact'
import { useTranslation } from '../i18n'

interface ChatBubbleProps {
  onClick: () => void
  isOpen: boolean
  primaryColor: string
  position: 'bottom-right' | 'bottom-left'
  customStyle?: Record<string, string>
  unreadCount?: number
}

export function ChatBubble({
  onClick,
  isOpen,
  primaryColor,
  position,
  customStyle,
  unreadCount = 0,
}: ChatBubbleProps): JSX.Element {
  const t = useTranslation()

  // Merge custom styles with backgroundColor
  const inlineStyle: Record<string, string> = {
    backgroundColor: primaryColor,
    ...customStyle,
  }

  return (
    <button
      type="button"
      class={`supprt-bubble ${position === 'bottom-left' ? 'supprt-bubble--left' : ''} ${customStyle ? 'supprt-bubble--custom' : ''}`}
      onClick={onClick}
      style={inlineStyle}
      aria-label={isOpen ? t.ariaCloseChat : t.ariaOpenChat}
    >
      {isOpen ? <X size={24} aria-hidden="true" /> : <MessageSquare size={24} aria-hidden="true" />}
      {unreadCount > 0 && !isOpen && <span class="supprt-bubble__badge">!</span>}
    </button>
  )
}
