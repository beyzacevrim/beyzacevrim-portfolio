import { useCallback, useEffect, useMemo, useState } from 'react'
import { LanguageContext } from './context.js'
import { detectLanguage, isSupportedLanguage, saveLanguage } from './languages.js'
import { locales } from './locales/index.js'

export default function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectLanguage)

  const setLang = useCallback((code) => {
    if (!isSupportedLanguage(code)) return
    setLangState(code)
    saveLanguage(code)
  }, [])

  // Keeps <html lang> in sync so screen readers, hyphenation and text-transform follow the language.
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t: locales[lang] }), [lang, setLang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
