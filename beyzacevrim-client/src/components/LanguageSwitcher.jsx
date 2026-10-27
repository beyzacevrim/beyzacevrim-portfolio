import useI18n from '../hooks/useI18n.js'
import { LANGUAGES } from '../i18n/languages.js'

const VARIANTS = {
  compact: {
    group: 'gap-0.5 rounded-full border-2 border-ink p-0.5',
    button: 'rounded-full px-2.5 py-1 font-mono text-xs font-semibold',
    active: 'bg-ink text-cream',
    idle: 'hover:bg-lime',
  },
  large: {
    group: 'gap-2',
    button: 'rounded-full border-2 border-cream/40 px-4 py-2 font-mono text-sm font-semibold',
    active: 'border-lime bg-lime text-ink',
    idle: 'text-cream hover:border-lime hover:text-lime',
  },
}

export default function LanguageSwitcher({ variant = 'compact', className = '' }) {
  const { lang, setLang, t } = useI18n()
  const styles = VARIANTS[variant]

  return (
    <div role="group" aria-label={t.nav.language} className={`flex items-center ${styles.group} ${className}`}>
      {LANGUAGES.map((language) => {
        const active = language.code === lang
        return (
          <button
            key={language.code}
            type="button"
            lang={language.code}
            title={language.name}
            aria-label={language.name}
            aria-pressed={active}
            onClick={() => setLang(language.code)}
            className={`transition-colors ${styles.button} ${active ? styles.active : styles.idle}`}
          >
            {language.label}
          </button>
        )
      })}
    </div>
  )
}
