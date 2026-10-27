import { organizationName, timeline } from '../data/experience.js'
import { contactLinks, profile } from '../data/profile.js'
import { researchInterests } from '../data/research.js'
import { solutions } from '../data/solutions.js'
import { stackGroups } from '../data/stack.js'
import { formatPeriod, plainHeadline, term } from '../i18n/format.js'
import { LANGUAGE_CODES, getIntlLocale, isSupportedLanguage } from '../i18n/languages.js'

// Command names are the same in every language; their output follows the active locale.
// Each command receives (args, { t, lang, history }) and returns { lines, action? }.
// A line is a string or { text, tone } where tone is 'accent' | 'muted' | 'error' | 'success'.
// Actions are carried out by the Terminal component: 'clear', 'navigate' (with `to`)
// and 'language' (with `code`).

const muted = (text) => ({ text, tone: 'muted' })
const accent = (text) => ({ text, tone: 'accent' })
const error = (text) => ({ text, tone: 'error' })
const pad = (text, width) => text.padEnd(width, ' ')

const USAGE = { open: '<slug>', lang: '<code>', echo: '<text>' }

const COMMANDS = {
  help: (args, { t }) => ({
    lines: [
      accent(t.terminal.helpTitle),
      ...Object.keys(COMMANDS).map((name) => `  ${pad(name + (USAGE[name] ? ` ${USAGE[name]}` : ''), 16)} ${t.terminal.commands[name]}`),
      muted(t.terminal.helpTip),
    ],
  }),
  whoami: (args, { t }) => ({ lines: [accent(profile.name), t.hero.role, muted(plainHeadline(t))] }),
  about: (args, { t }) => ({ lines: t.about.paragraphs.flatMap((paragraph, i) => (i === 0 ? [paragraph] : ['', paragraph])) }),
  experience: (args, { t, lang }) => ({
    lines: timeline
      .filter((item) => item.type !== 'education')
      .flatMap((item) => [
        accent(t.timeline[item.id].title),
        `  ${[organizationName(item, t), formatPeriod(item, lang, t)].filter(Boolean).join(' · ')}`,
        muted(`  ${t.timeline[item.id].summary}`),
      ]),
  }),
  education: (args, { t, lang }) => ({
    lines: timeline
      .filter((item) => item.type === 'education')
      .flatMap((item) => [accent(t.timeline[item.id].title), `  ${organizationName(item, t)} · ${formatPeriod(item, lang, t)}`]),
  }),
  solutions: (args, { t }) => ({
    lines: [
      ...solutions.map((s) => `  ${pad(s.slug, 20)} ${t.solutions.items[s.slug].title}`),
      muted(t.terminal.solutionsHint),
    ],
  }),
  open: ([slug], { t }) => {
    if (!slug) return { lines: [error(t.terminal.openUsage), muted(`${t.terminal.slugs}: ${solutions.map((s) => s.slug).join(', ')}`)] }
    const solution = solutions.find((s) => s.slug === slug.toLowerCase())
    if (!solution) return { lines: [error(t.terminal.solutionNotFound(slug))] }
    return {
      lines: [{ text: t.terminal.opening(t.solutions.items[solution.slug].title), tone: 'success' }],
      action: { type: 'navigate', to: `/solutions/${solution.slug}` },
    }
  },
  stack: (args, { t }) => ({
    lines: stackGroups.map((group) => `  ${pad(t.stack.groups[group.id], 26)} ${group.items.map((item) => term(t, item)).join(', ')}`),
  }),
  research: (args, { t }) => ({
    lines: researchInterests.flatMap(({ id }) => [accent(t.research.items[id].title), muted(`  ${t.research.items[id].description}`)]),
  }),
  contact: (args, { t }) => ({
    lines: [...contactLinks.map((link) => `  ${pad(t.contact.linkLabels[link.key], 10)} ${link.display}`), t.terminal.contactForm],
    action: { type: 'navigate', to: '/#contact' },
  }),
  lang: ([code], { t }) => {
    const normalized = code?.toLowerCase()
    if (!isSupportedLanguage(normalized)) return { lines: [error(t.terminal.langUsage)] }
    // The confirmation line is added by the Terminal in the new language.
    return { lines: [], action: { type: 'language', code: normalized } }
  },
  history: (args, { t, history }) => ({
    lines: history.length ? history.map((cmd, i) => `  ${String(i + 1).padStart(3)}  ${cmd}`) : [muted(t.terminal.noHistory)],
  }),
  date: (args, { lang }) => ({
    lines: [new Date().toLocaleString(getIntlLocale(lang), { dateStyle: 'full', timeStyle: 'short' })],
  }),
  echo: (args) => ({ lines: [args.join(' ')] }),
  clear: () => ({ lines: [], action: { type: 'clear' } }),
}

// Hidden commands work but are not listed in `help`.
const HIDDEN = {
  sudo: (args, { t }) => ({ lines: [error(t.terminal.sudo)] }),
  ls: (args, context) => COMMANDS.solutions(args, context),
  projects: (args, context) => COMMANDS.solutions(args, context),
  hello: (args, { t }) => ({ lines: [t.terminal.hello(profile.firstName)] }),
}

export const welcomeLines = (t) => [accent(t.terminal.welcome(profile.name)), muted(t.terminal.welcomeHint)]

export function runCommand(input, context) {
  const [name, ...args] = input.trim().split(/\s+/)
  const key = name.toLowerCase()

  if (COMMANDS[key]) return COMMANDS[key](args, context)
  if (HIDDEN[key]) return HIDDEN[key](args, context)
  return { lines: [error(context.t.terminal.commandNotFound(name))] }
}

// Completes a command name, a solution slug after `open`, or a language code after `lang`.
export function completeCommand(input) {
  const [name, arg, ...rest] = input.trimStart().split(/\s+/)
  if (rest.length) return null

  if (arg === undefined) {
    const matches = Object.keys(COMMANDS).filter((cmd) => cmd.startsWith(name.toLowerCase()))
    return matches.length === 1 ? `${matches[0]} ` : null
  }

  const candidates = { open: solutions.map((s) => s.slug), lang: LANGUAGE_CODES }[name.toLowerCase()]
  if (!candidates) return null
  const matches = candidates.filter((value) => value.startsWith(arg.toLowerCase()))
  return matches.length === 1 ? `${name.toLowerCase()} ${matches[0]}` : null
}
