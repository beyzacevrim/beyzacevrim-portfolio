import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { formatPeriod, plainHeadline, term } from './format.js'
import { locales } from './locales/index.js'

describe('formatPeriod', () => {
  const ongoing = { start: '2025-06', end: null }
  const sameYear = { start: '2024-08', end: '2024-09' }
  const graduated = { kind: 'graduated', date: '2025-06' }

  it('formats an ongoing period with the localized "present" label', () => {
    assert.equal(formatPeriod(ongoing, 'en', locales.en), 'June 2025 — Today')
    assert.equal(formatPeriod(ongoing, 'tr', locales.tr), 'Haziran 2025 — Günümüz')
    assert.equal(formatPeriod(ongoing, 'de', locales.de), 'Juni 2025 — heute')
  })

  it('shows the year once when start and end share it', () => {
    assert.equal(formatPeriod(sameYear, 'en', locales.en), 'August — September 2024')
    assert.equal(formatPeriod(sameYear, 'tr', locales.tr), 'Ağustos — Eylül 2024')
  })

  it('capitalizes month names in languages that write them in lowercase', () => {
    assert.match(formatPeriod(sameYear, 'es', locales.es), /^Agosto — septiembre de 2024$/)
  })

  it('formats an expected year range', () => {
    const expected = { kind: 'expected', start: '2026', end: '2027' }
    assert.equal(formatPeriod(expected, 'en', locales.en), '2026 — 2027 (expected)')
    assert.equal(formatPeriod(expected, 'tr', locales.tr), '2026 — 2027 (tahmini bitiş)')
  })

  it('formats a graduation date', () => {
    assert.equal(formatPeriod(graduated, 'en', locales.en), 'Graduated June 2025')
    assert.equal(formatPeriod(graduated, 'tr', locales.tr), 'Mezuniyet Haziran 2025')
  })
})

describe('term', () => {
  it('translates known terms and passes proper nouns through', () => {
    assert.equal(term(locales.tr, 'Third-party API integrations'), 'Diğer servislerle bağlantılar')
    assert.equal(term(locales.tr, 'MongoDB'), 'MongoDB')
  })
})

describe('plainHeadline', () => {
  it('joins the headline parts and ends with a period', () => {
    assert.equal(plainHeadline(locales.en), 'I build things that make ideas work.')
    assert.equal(plainHeadline(locales.tr), 'Fikirleri hayata geçiren yazılımlar geliştiriyorum.')
  })
})
