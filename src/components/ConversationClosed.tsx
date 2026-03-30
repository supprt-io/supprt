import type { JSX } from 'preact'
import { useTranslation } from '../i18n'

interface ConversationClosedProps {
  primaryColor: string
  hasOpenConversation: boolean
  onNewConversation: () => void
}

export function ConversationClosed({
  primaryColor,
  hasOpenConversation,
  onNewConversation,
}: ConversationClosedProps): JSX.Element {
  const t = useTranslation()

  return (
    <div class="supprt-closed">
      <div class="supprt-closed__icon">✓</div>
      <p class="supprt-closed__text">{t.conversationResolved}</p>
      {!hasOpenConversation && (
        <button
          type="button"
          class="supprt-closed__button"
          onClick={onNewConversation}
          style={{ backgroundColor: primaryColor }}
        >
          {t.startNewConversation}
        </button>
      )}
    </div>
  )
}
