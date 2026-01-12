import { ChevronLeft, X } from 'lucide-preact'
import type { JSX } from 'preact'
import { useTranslation } from '../i18n'

interface ChatHeaderProps {
  title: string
  primaryColor: string
  showBackButton: boolean
  onBack: () => void
  onClose: () => void
}

export function ChatHeader({
  title,
  primaryColor,
  showBackButton,
  onBack,
  onClose,
}: ChatHeaderProps): JSX.Element {
  const t = useTranslation()

  return (
    <header class="supprt-header" style={{ backgroundColor: primaryColor }}>
      <div class="supprt-header__content">
        {showBackButton && (
          <button
            type="button"
            class="supprt-header__back"
            onClick={onBack}
            aria-label={t.ariaBackToConversations}
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
        )}
        <h2 class="supprt-header__title">{title}</h2>
      </div>
      <button
        type="button"
        class="supprt-header__close"
        onClick={onClose}
        aria-label={t.ariaCloseChat}
      >
        <X size={20} aria-hidden="true" />
      </button>
    </header>
  )
}
