import { AlertCircle } from 'lucide-preact'
import type { JSX } from 'preact'
import { useTranslation } from '../i18n'

interface ErrorStateProps {
  onRetry: () => void
  primaryColor: string
}

export function ErrorState({ onRetry, primaryColor }: ErrorStateProps): JSX.Element {
  const t = useTranslation()

  return (
    <div class="supprt-error-state">
      <div class="supprt-error-state__icon">
        <AlertCircle size={48} strokeWidth={1.5} />
      </div>
      <h3 class="supprt-error-state__title">{t.errorTitle}</h3>
      <p class="supprt-error-state__description">{t.errorDescription}</p>
      <button
        type="button"
        class="supprt-error-state__button"
        style={{ backgroundColor: primaryColor }}
        onClick={onRetry}
      >
        {t.tryAgain}
      </button>
    </div>
  )
}
