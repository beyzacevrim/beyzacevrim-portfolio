import { ArrowLeft, ArrowRight, Check, MessageCircle, Sparkles } from 'lucide-react'
import { Link, useParams } from 'react-router'
import Reveal from '../components/Reveal.jsx'
import SolutionPreview from '../components/SolutionPreview.jsx'
import { themeClasses } from '../data/site.js'
import { getNextSolution, getSolutionBySlug } from '../data/solutions.js'
import useI18n from '../hooks/useI18n.js'
import usePageMeta from '../hooks/usePageMeta.js'
import NotFoundPage from './NotFoundPage.jsx'

function SolutionDetail({ solution }) {
  const { t } = useI18n()
  const text = t.solutions.items[solution.slug]
  const theme = themeClasses[solution.theme] ?? themeClasses.cream
  const next = getNextSolution(solution.slug)
  const nextTheme = themeClasses[next.theme] ?? themeClasses.cream

  usePageMeta({ title: text.title, description: text.summary })

  return (
    <article>
      <header className={`grain relative overflow-hidden ${theme.bg} ${theme.text}`}>
        <div className="mx-auto max-w-7xl px-5 pt-10 pb-16 sm:px-8 lg:pb-24">
          <Link
            to={{ pathname: '/', hash: '#solutions' }}
            className="inline-flex items-center gap-2 rounded-full border-2 border-current px-4 py-1.5 text-sm font-semibold transition-transform hover:-translate-x-1"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> {t.solution.all}
          </Link>

          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-6">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em]">{t.solutions.eyebrow}</p>
              <h1 className="font-display text-[clamp(2.75rem,6.5vw,5.5rem)] leading-[0.92] font-extrabold tracking-[-0.035em] text-balance hyphens-auto">
                {text.title}
              </h1>
              <p className="mt-8 max-w-lg text-xl leading-relaxed sm:text-2xl">{text.summary}</p>
            </div>
            <div className="lg:col-span-6">
              <SolutionPreview variant={solution.preview} className="lg:rotate-2" />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:py-28">
        <Reveal className="lg:col-span-5">
          <p className="font-display text-2xl leading-snug font-medium tracking-tight sm:text-3xl">{text.description}</p>
          <h2 className="mt-12 mb-4 font-mono text-xs uppercase tracking-[0.2em] text-ink/70">{t.solution.forWho}</h2>
          <p className="text-lg text-ink/80">{text.forWho}</p>
        </Reveal>

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal>
            <h2 className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-ink/70">{t.solution.features}</h2>
            <ul className="space-y-3">
              {text.features.map((feature) => (
                <li key={feature} className="flex items-start gap-4 rounded-2xl border-2 border-ink bg-white/60 p-4 text-lg">
                  <span className={`flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-ink ${theme.bg} ${theme.text}`}>
                    <Check className="size-4" strokeWidth={3} aria-hidden="true" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className={`mt-10 flex gap-4 rounded-2xl p-6 ${theme.soft}`}>
            <Sparkles className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <p className="text-ink/75">{t.solution.note}</p>
          </Reveal>

          <Reveal className="mt-6 flex flex-col items-start gap-5 rounded-2xl border-2 border-ink p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-display text-2xl font-bold tracking-tight">{t.solution.ctaTitle}</p>
            <Link
              to={{ pathname: '/', hash: '#contact' }}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-5 py-3 font-semibold text-cream transition-colors hover:bg-cobalt"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              {t.solution.ctaButton}
            </Link>
          </Reveal>
        </div>
      </div>

      <Link to={`/solutions/${next.slug}`} className={`group block ${nextTheme.bg} ${nextTheme.text}`}>
        <div className="mx-auto flex max-w-7xl items-end justify-between gap-6 px-5 py-14 sm:px-8 lg:py-20">
          <div className="min-w-0">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em]">{t.solution.next}</p>
            <p className="font-display text-4xl font-extrabold tracking-tight text-balance hyphens-auto sm:text-6xl">
              {t.solutions.items[next.slug].title}
            </p>
          </div>
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-current transition-transform duration-300 group-hover:translate-x-2 sm:size-20">
            <ArrowRight className="size-6 sm:size-8" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  )
}

export default function SolutionPage() {
  const { t } = useI18n()
  const { slug } = useParams()
  const solution = getSolutionBySlug(slug)

  if (!solution) return <NotFoundPage message={t.solution.notFound} />
  // Keyed by slug so per-page state (reveal animations) resets when moving between solutions.
  return <SolutionDetail key={solution.slug} solution={solution} />
}
