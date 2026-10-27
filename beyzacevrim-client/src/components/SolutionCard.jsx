import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { themeClasses } from '../data/site.js'
import useI18n from '../hooks/useI18n.js'
import SolutionPreview from './SolutionPreview.jsx'

export default function SolutionCard({ solution, index }) {
  const { t } = useI18n()
  const theme = themeClasses[solution.theme] ?? themeClasses.cream
  const text = t.solutions.items[solution.slug]

  return (
    <Link to={`/solutions/${solution.slug}`} className="group block" aria-label={`${text.title}: ${text.summary}`}>
      <div className={`grain relative overflow-hidden rounded-[2rem] ${theme.bg} p-6 sm:p-10`}>
        <span
          className={`absolute top-5 right-6 font-mono text-xs tracking-widest ${theme.text} opacity-70`}
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <SolutionPreview
          variant={solution.preview}
          className="mx-auto max-w-lg transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:-rotate-1"
        />
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-display text-3xl leading-tight font-bold tracking-tight text-balance hyphens-auto sm:text-4xl">{text.title}</h3>
          <p className="mt-2 max-w-md text-ink/70">{text.summary}</p>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.16em] text-ink/70">{t.solutions.cardCta}</p>
        </div>
        <span className="mt-1 flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-ink transition-all duration-300 group-hover:rotate-45 group-hover:bg-ink group-hover:text-lime">
          <ArrowUpRight className="size-5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
