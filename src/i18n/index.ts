import { createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { de } from './locales/de'
import { en } from './locales/en'
import { es } from './locales/es'
import { fr } from './locales/fr'
import type { SupportedLocale, Translations } from './types'

export type { SupportedLocale, Translations }

const locales: Record<SupportedLocale, Translations> = {
  en,
  fr,
  es,
  de,
}

export function detectLocale(): SupportedLocale {
  if (typeof navigator === 'undefined') return 'en'
  const browserLang = navigator.language.split('-')[0]
  if (browserLang in locales) {
    return browserLang as SupportedLocale
  }
  return 'en'
}

export function getTranslations(locale?: string): Translations {
  if (locale && locale in locales) {
    return locales[locale as SupportedLocale]
  }
  return locales[detectLocale()]
}

export const I18nContext = createContext<Translations>(en)

export function useTranslation(): Translations {
  return useContext(I18nContext)
}
