import { getIntlLocale } from './languages.js'

const toDate = (yearMonth) => {
  const [year, month] = yearMonth.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, 1))
}

const format = (lang, yearMonth, options) =>
  new Intl.DateTimeFormat(getIntlLocale(lang), { timeZone: 'UTC', ...options }).format(toDate(yearMonth))

const capitalize = (text) => text.charAt(0).toLocaleUpperCase() + text.slice(1)

/**
 * Formats a timeline period from 'YYYY-MM' values.
 * { start, end }        → "June 2025 — Present" / "August — September 2024"
 * { date, kind: 'graduated' } → "Graduated June 2025"
 * { start, end, kind: 'expected' } (years) → "2026 — 2027 (expected)"
 */
export function formatPeriod(item, lang, t) {
  if (item.kind === 'expected') return `${item.start} — ${item.end} (${t.about.expected})`

  if (item.kind === 'graduated') {
    return `${t.about.graduated} ${format(lang, item.date, { month: 'long', year: 'numeric' })}`
  }

  if (!item.end) {
    return `${capitalize(format(lang, item.start, { month: 'long', year: 'numeric' }))} — ${t.about.present}`
  }

  const sameYear = item.start.slice(0, 4) === item.end.slice(0, 4)
  const start = format(lang, item.start, sameYear ? { month: 'long' } : { month: 'long', year: 'numeric' })
  return `${capitalize(start)} — ${format(lang, item.end, { month: 'long', year: 'numeric' })}`
}

// Translates a technology or tag name when the locale has a translation; proper nouns pass through.
export const term = (t, value) => t.terms[value] ?? value

export const plainHeadline = (t) => `${t.hero.headline.before}${t.hero.headline.highlight}${t.hero.headline.after}.`
