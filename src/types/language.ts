export type Language = 'pt' | 'en' | 'es'

export const LANGUAGES = {
  pt: 'Português',
  en: 'English',
  es: 'Español'
} as const

export const LANGUAGE_CODES = Object.keys(LANGUAGES) as Language[]