import { useContext } from 'react'
import { LanguageContext } from '../i18n/context.js'

// Returns { lang, setLang, t } where t is the active locale object.
export default function useI18n() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useI18n must be used inside LanguageProvider')
  return context
}
