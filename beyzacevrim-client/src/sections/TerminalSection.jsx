import Reveal from '../components/Reveal.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import Terminal from '../components/Terminal.jsx'
import useI18n from '../hooks/useI18n.js'

export default function TerminalSection() {
  const { t } = useI18n()

  return (
    <section id="terminal" className="bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
        <SectionHeader index="05" eyebrow={t.terminal.eyebrow} title={t.terminal.title} intro={t.terminal.intro} tone="light" />
        <Reveal className="mt-14">
          <Terminal />
        </Reveal>
      </div>
    </section>
  )
}
