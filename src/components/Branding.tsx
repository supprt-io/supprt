import type { JSX } from 'preact'
import { useTranslation } from '../i18n'

export function Branding(): JSX.Element {
  const t = useTranslation()

  return (
    <footer class="supprt-branding">
      <a
        href="https://supprt.dev"
        target="_blank"
        rel="noopener noreferrer"
        class="supprt-branding__link"
      >
        {t.poweredBy} <strong>Supprt</strong>
      </a>
    </footer>
  )
}
