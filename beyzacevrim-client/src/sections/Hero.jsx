import { ArrowDown, MessageCircle } from 'lucide-react'
import portrait from '../assets/beyza-cevrim.webp'
import useI18n from '../hooks/useI18n.js'

// Circumference of the badge's text circle (r = 38).
const BADGE_PATH_LENGTH = 2 * Math.PI * 38

function RotatingBadge({ text, className = '' }) {
  // Monospace glyphs are ~0.6em wide; shrink the font for longer translations so the text fits the circle.
  const fontSize = Math.min(8.6, (BADGE_PATH_LENGTH - 4) / (text.length * 0.6))
  return (
    <div className={`flex size-32 items-center justify-center rounded-full bg-lime sm:size-36 ${className}`} aria-hidden="true">
      <svg viewBox="0 0 100 100" className="absolute size-full animate-spin-slow">
        <defs>
          <path id="badge-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text className="fill-ink font-mono font-semibold" style={{ fontSize }}>
          <textPath href="#badge-circle" textLength={BADGE_PATH_LENGTH - 2} lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="font-serif text-4xl italic">BÇ</span>
    </div>
  )
}

function Marquee() {
  const { t } = useI18n()
  const items = [...t.hero.marquee, ...t.hero.marquee]
  return (
    <div className="overflow-hidden border-y-2 border-ink bg-ink py-4 text-cream" aria-hidden="true">
      <div className="flex w-max animate-marquee gap-8 hover:[animation-play-state:paused]">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-8 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {item}
            <span className="text-lime">✳</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Hero() {
  const { t } = useI18n()
  const { before, highlight, after } = t.hero.headline
  // Longer translations get a smaller display size so the headline keeps a similar shape.
  const headlineSize =
    (before + highlight + after).length > 40 ? 'text-[clamp(2.6rem,7.6vw,6.4rem)]' : 'text-[clamp(3.1rem,10.5vw,8.75rem)]'

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      {/* Background color blocks */}
      <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-orange/90 sm:size-96 lg:top-10 lg:-right-10" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-24 -left-16 size-40 rotate-12 rounded-[2.5rem] bg-lavender/70" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pt-12 pb-20 sm:px-8 sm:pt-16 lg:grid-cols-12 lg:gap-8 lg:pt-20 lg:pb-28">
        <div className="lg:col-span-8">
          <p className="mb-8 inline-flex items-center gap-3 rounded-full border-2 border-ink bg-cream px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] sm:text-xs">
            <span className="size-2 shrink-0 rounded-full bg-orange" aria-hidden="true" />
            {t.hero.role}
          </p>

          <h1
            id="hero-title"
            className={`font-display ${headlineSize} leading-[0.9] font-extrabold tracking-[-0.045em] text-balance`}
          >
            {before}
            <span className="relative isolate inline-block font-serif font-normal italic tracking-[-0.02em]">
              <span className="absolute inset-x-[-0.08em] bottom-[0.08em] -z-10 h-[0.42em] -rotate-1 bg-lavender" aria-hidden="true" />
              {highlight}
            </span>
            {after}
            <span className="text-orange">.</span>
          </h1>

          <p className="mt-10 max-w-xl text-lg leading-relaxed text-ink/75 sm:text-xl">{t.hero.intro}</p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-semibold text-cream transition-colors hover:bg-cobalt"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              {t.hero.ctaPrimary}
            </a>
            <a
              href="#solutions"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-ink bg-cream px-6 py-3 font-semibold transition-colors hover:bg-lime"
            >
              {t.hero.ctaSecondary}
              <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="relative pb-10 lg:col-span-4 lg:pt-16 lg:pb-0">
          <div className="relative mx-auto max-w-sm lg:rotate-2">
            <img
              src={portrait}
              alt={t.hero.photoAlt}
              width="720"
              height="762"
              fetchPriority="high"
              className="w-full rounded-[2rem] border-2 border-ink object-cover shadow-[8px_8px_0_0_var(--color-ink)]"
            />
            <RotatingBadge text={t.hero.badge} className="absolute -right-4 -bottom-12 sm:-right-8" />
          </div>
        </div>
      </div>

      <Marquee />
    </section>
  )
}
