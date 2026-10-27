import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { locales } from '../i18n/locales/index.js'
import { completeCommand, runCommand } from './terminalCommands.js'

const context = (lang = 'en', history = []) => ({ t: locales[lang], lang, history })
const text = (result) => result.lines.map((line) => (typeof line === 'string' ? line : line.text)).join('\n')

describe('runCommand', () => {
  it('lists every visible command in help, with descriptions in the active language', () => {
    const output = text(runCommand('help', context('tr')))
    for (const name of Object.keys(locales.tr.terminal.commands)) assert.match(output, new RegExp(`\\b${name}\\b`))
    assert.match(output, /Kullanılabilir komutlar/)
  })

  it('opens a solution page', () => {
    const result = runCommand('open websites', context())
    assert.deepEqual(result.action, { type: 'navigate', to: '/solutions/websites' })
  })

  it('reports unknown solutions and missing arguments', () => {
    assert.match(text(runCommand('open nothing', context())), /Nothing called 'nothing'/)
    assert.match(text(runCommand('open', context())), /Usage: open <slug>/)
  })

  it('switches language only to supported codes', () => {
    assert.deepEqual(runCommand('lang DE', context()).action, { type: 'language', code: 'de' })
    assert.equal(runCommand('lang fr', context()).action, undefined)
  })

  it('keeps `projects` as a hidden alias of `solutions`', () => {
    assert.equal(text(runCommand('projects', context())), text(runCommand('solutions', context())))
  })

  it('answers unknown commands with a hint', () => {
    assert.match(text(runCommand('rm -rf /', context('de'))), /Befehl nicht gefunden: rm/)
  })

  it('shows history passed in by the terminal', () => {
    assert.match(text(runCommand('history', context('en', ['help', 'stack']))), /1 {2}help\n.*2 {2}stack/)
  })
})

describe('completeCommand', () => {
  it('completes unique command prefixes', () => {
    assert.equal(completeCommand('exp'), 'experience ')
    assert.equal(completeCommand('e'), null) // echo, education, experience
  })

  it('completes solution slugs and language codes', () => {
    assert.equal(completeCommand('open proc'), 'open process-software')
    assert.equal(completeCommand('lang t'), 'lang tr')
  })
})
