import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { timeline } from '../data/experience.js'
import { academicProjects, researchInterests } from '../data/research.js'
import { solutions } from '../data/solutions.js'
import { stackGroups } from '../data/stack.js'
import { LANGUAGE_CODES } from './languages.js'
import { locales } from './locales/index.js'

// Flattens a locale into "path:type" entries. Arrays keep their length so every
// language has the same number of paragraphs, features and so on.
// `terms` is a per-language dictionary and may legitimately differ.
function shape(value, prefix = '') {
  return Object.entries(value).flatMap(([key, child]) => {
    const path = `${prefix}${key}`
    if (path === 'terms') return []
    if (Array.isArray(child)) return [`${path}:array(${child.length})`]
    if (child && typeof child === 'object') return shape(child, `${path}.`)
    return [`${path}:${typeof child}`]
  })
}

describe('locales', () => {
  it('exist for every supported language', () => {
    assert.deepEqual(Object.keys(locales).sort(), [...LANGUAGE_CODES].sort())
  })

  const reference = shape(locales.en)
  for (const code of LANGUAGE_CODES) {
    it(`${code} has exactly the same keys as en`, () => {
      assert.deepEqual(shape(locales[code]), reference)
    })
  }

  it('cover every solution, stack group, research interest, academic item and timeline entry', () => {
    for (const code of LANGUAGE_CODES) {
      const t = locales[code]
      for (const { slug } of solutions) assert.ok(t.solutions.items[slug]?.title, `${code}: solution ${slug}`)
      for (const { id } of stackGroups) assert.ok(t.stack.groups[id], `${code}: stack group ${id}`)
      for (const { id } of researchInterests) assert.ok(t.research.items[id]?.title, `${code}: research ${id}`)
      for (const { id } of timeline) assert.ok(t.timeline[id]?.title, `${code}: timeline ${id}`)
      for (const { id } of academicProjects) assert.ok(t.research.academicItems[id]?.title, `${code}: academic ${id}`)
    }
  })

  // Headline parts around the highlighted word may be empty, depending on word order.
  it('have no empty strings (except headline parts)', () => {
    const walk = (value, path) => {
      if (typeof value === 'string' && !/\.(before|after)$/.test(path)) assert.ok(value.trim(), `empty string at ${path}`)
      else if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) walk(v, `${path}.${k}`)
    }
    for (const code of LANGUAGE_CODES) walk(locales[code], code)
  })
})

// The portfolio must only describe types of solutions, never real client or company projects.
// Names are assembled from parts so this file does not contain them itself.
describe('content policy', () => {
  const forbidden = [['Oda', 'net'], ['ATS', '[Iİ]S'], ['Sosyal', 'net'], ['B2B', 'merkezim']].map(([a, b]) => new RegExp(a + b, 'i'))
  const srcDir = fileURLToPath(new URL('..', import.meta.url))
  const files = (dir) =>
    readdirSync(dir).flatMap((name) => {
      const path = join(dir, name)
      return statSync(path).isDirectory() ? files(path) : [path]
    })

  it('no real project names appear anywhere in src or index.html', () => {
    const targets = [...files(srcDir), fileURLToPath(new URL('../../index.html', import.meta.url))]
    for (const file of targets) {
      const text = readFileSync(file, 'utf8')
      for (const pattern of forbidden) assert.doesNotMatch(text, pattern, `${file} mentions a real project`)
    }
  })
})
