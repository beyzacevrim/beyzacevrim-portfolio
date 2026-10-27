import Reveal from './Reveal.jsx'

export default function SectionHeader({ index, eyebrow, title, intro, tone = 'dark', className = '' }) {
  const mutedText = tone === 'light' ? 'text-cream/70' : 'text-ink/75'

  return (
    <Reveal className={`grid gap-6 md:grid-cols-12 md:items-end ${className}`}>
      <div className="md:col-span-8">
        <p className={`mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] ${mutedText}`}>
          <span>{index}</span>
          <span className="h-px w-10 bg-current" aria-hidden="true" />
          <span>{eyebrow}</span>
        </p>
        <h2 className="font-display text-5xl leading-[0.95] font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
          {title}
        </h2>
      </div>
      {intro && <p className={`max-w-md text-lg leading-relaxed md:col-span-4 ${mutedText}`}>{intro}</p>}
    </Reveal>
  )
}
