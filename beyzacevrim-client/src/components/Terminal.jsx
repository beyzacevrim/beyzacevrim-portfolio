import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import useI18n from '../hooks/useI18n.js'
import { locales } from '../i18n/locales/index.js'
import { completeCommand, runCommand, welcomeLines } from '../utils/terminalCommands.js'

const PROMPT = 'beyza@portfolio:~$'
const SUGGESTIONS = ['help', 'whoami', 'solutions', 'experience', 'stack', 'lang tr']

const TONES = {
  accent: 'text-lime',
  muted: 'text-cream/50',
  error: 'text-orange',
  success: 'text-lavender',
}

const toEntry = (line) => (typeof line === 'string' ? { text: line } : line)

let nextId = 0
const withIds = (lines) => lines.map((line) => ({ id: nextId++, ...toEntry(line) }))

export default function Terminal() {
  const { t, lang, setLang } = useI18n()
  // The welcome entry is rendered from the active locale, so it follows language changes.
  const [entries, setEntries] = useState(() => [{ id: nextId++, welcome: true }])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(null)
  const inputRef = useRef(null)
  const outputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const output = outputRef.current
    if (output) output.scrollTop = output.scrollHeight
  }, [entries])

  const execute = (raw) => {
    const command = raw.trim()
    const echo = { text: `${PROMPT} ${raw}`, tone: 'prompt' }

    if (!command) {
      setEntries((current) => [...current, ...withIds([echo])])
      return
    }

    const { lines, action } = runCommand(command, { t, lang, history })
    setHistory((current) => [...current, command])
    setHistoryIndex(null)

    if (action?.type === 'clear') {
      setEntries([])
      return
    }

    const extra = action?.type === 'language' ? [{ text: locales[action.code].terminal.langChanged, tone: 'success' }] : []
    setEntries((current) => [...current, ...withIds([echo, ...lines, ...extra])])

    if (action?.type === 'language') setLang(action.code)
    if (action?.type === 'navigate') setTimeout(() => navigate(action.to), 450)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    execute(input)
    setInput('')
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowUp' && history.length) {
      event.preventDefault()
      const index = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(index)
      setInput(history[index])
    } else if (event.key === 'ArrowDown' && historyIndex !== null) {
      event.preventDefault()
      const index = historyIndex + 1
      if (index >= history.length) {
        setHistoryIndex(null)
        setInput('')
      } else {
        setHistoryIndex(index)
        setInput(history[index])
      }
    } else if (event.key === 'Tab') {
      const completion = completeCommand(input)
      if (input && completion) {
        event.preventDefault()
        setInput(completion)
      }
    } else if (event.key === 'l' && event.ctrlKey) {
      event.preventDefault()
      setEntries([])
    }
  }

  const rendered = entries.flatMap((entry) =>
    entry.welcome ? welcomeLines(t).map((line, i) => ({ id: `${entry.id}-${i}`, ...toEntry(line) })) : [entry],
  )

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-cream/15 bg-[#1b1b1b] shadow-[10px_10px_0_0_var(--color-cobalt)]">
      <div className="flex items-center gap-2 border-b border-cream/10 px-4 py-3">
        <span className="size-3 rounded-full bg-orange" />
        <span className="size-3 rounded-full bg-lime" />
        <span className="size-3 rounded-full bg-lavender" />
        <span className="ml-3 font-mono text-xs text-cream/50">{t.terminal.windowTitle}</span>
      </div>

      {/* Clicking anywhere in the output focuses the prompt, like a real terminal. */}
      <div
        ref={outputRef}
        className="h-80 overflow-y-auto px-4 py-4 font-mono text-[13px] leading-relaxed text-cream sm:h-96 sm:px-5 sm:text-sm"
        onClick={() => inputRef.current?.focus({ preventScroll: true })}
        role="log"
        aria-live="polite"
        aria-label={t.terminal.outputLabel}
      >
        {rendered.map((entry) => (
          <div
            key={entry.id}
            className={`min-h-[1.5em] break-words whitespace-pre-wrap ${entry.tone === 'prompt' ? 'text-cream' : (TONES[entry.tone] ?? 'text-cream/85')}`}
          >
            {entry.tone === 'prompt' ? (
              <>
                <span className="text-lime">{PROMPT}</span>
                {entry.text.slice(PROMPT.length)}
              </>
            ) : (
              entry.text
            )}
          </div>
        ))}

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="shrink-0 text-lime" aria-hidden="true">
            {PROMPT}
          </span>
          <input
            id="terminal-input"
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            className="min-w-0 flex-1 bg-transparent text-cream caret-lime outline-none"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
            aria-label={t.terminal.inputLabel}
          />
        </form>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-cream/10 px-4 py-3">
        {SUGGESTIONS.map((command) => (
          <button
            key={command}
            type="button"
            onClick={() => {
              execute(command)
              inputRef.current?.focus({ preventScroll: true })
            }}
            className="rounded-full border border-cream/20 px-3 py-1 font-mono text-xs text-cream/80 transition-colors hover:border-lime hover:text-lime"
          >
            {command}
          </button>
        ))}
      </div>
    </div>
  )
}
