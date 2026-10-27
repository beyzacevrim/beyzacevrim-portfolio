export const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English', intl: 'en-GB' },
  { code: 'tr', label: 'TR', name: 'Türkçe', intl: 'tr-TR' },
  { code: 'es', label: 'ES', name: 'Español', intl: 'es-ES' },
  { code: 'de', label: 'DE', name: 'Deutsch', intl: 'de-DE' },
]

export const DEFAULT_LANGUAGE = 'en'
export const LANGUAGE_CODES = LANGUAGES.map((language) => language.code)

const STORAGE_KEY = 'beyzacevrim:lang'

export const isSupportedLanguage = (code) => LANGUAGE_CODES.includes(code)

export const getIntlLocale = (code) => LANGUAGES.find((language) => language.code === code)?.intl ?? 'en-GB'

// Saved choice first, then the browser's preferred languages, then English.
export function detectLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (isSupportedLanguage(saved)) return saved
  } catch {
    // Storage can be unavailable (private mode, blocked site data).
  }

  const preferred = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const tag of preferred) {
    const code = tag?.slice(0, 2).toLowerCase()
    if (isSupportedLanguage(code)) return code
  }
  return DEFAULT_LANGUAGE
}

export function saveLanguage(code) {
  try {
    localStorage.setItem(STORAGE_KEY, code)
  } catch {
    // Not persisting the choice is acceptable.
  }
}
