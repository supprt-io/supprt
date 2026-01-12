import type { JSX } from 'preact'
import { useTranslation } from '../i18n'

interface ConversationClosedProps {
  primaryColor: string
  onNewConversation: () => void
}

export function ConversationClosed({
  primaryColor,
  onNewConversation,
}: ConversationClosedProps): JSX.Element {
  const t = useTranslation()

  return (
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
  )
}
