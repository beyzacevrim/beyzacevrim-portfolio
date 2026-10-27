import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'
import useI18n from '../hooks/useI18n.js'
import usePageMeta from '../hooks/usePageMeta.js'

export default function NotFoundPage({ message }) {
  const { t } = useI18n()
  const { before, accent, after } = t.notFound.title
  usePageMeta({ title: t.notFound.pageTitle })

  return (
    <section className="relative mx-auto flex min-h-[70svh] max-w-7xl flex-col justify-center overflow-hidden px-5 py-24 sm:px-8">
      <div className="pointer-events-none absolute top-10 right-0 size-64 rounded-full bg-lavender sm:size-96" aria-hidden="true" />
      <p className="relative font-mono text-sm uppercase tracking-[0.2em] text-ink/75">{t.notFound.label}</p>
      <h1 className="relative mt-4 font-display text-[clamp(3.5rem,12vw,10rem)] leading-[0.85] font-extrabold tracking-tighter">
        {before}
        <span className="font-serif font-normal italic text-cobalt">{accent}</span>
        {after}
        <span className="text-orange">.</span>
      </h1>
      <p className="relative mt-8 max-w-md text-lg text-ink/75">{message ?? t.notFound.message}</p>
      <Link
        to="/"
        className="relative mt-10 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-semibold text-cream transition-colors hover:bg-cobalt"
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> {t.notFound.back}
      </Link>
    </section>
  )
}
