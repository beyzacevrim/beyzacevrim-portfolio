import { FlaskConical, HeartPulse } from 'lucide-react'
import Reveal from '../components/Reveal.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import Tag from '../components/Tag.jsx'
import { academicProjects, researchInterests } from '../data/research.js'
import { themeClasses } from '../data/site.js'
import useI18n from '../hooks/useI18n.js'

export default function Research() {
  const { t } = useI18n()

  return (
    <section id="research" className="grain bg-lavender">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
        <SectionHeader index="04" eyebrow={t.research.eyebrow} title={t.research.title} intro={t.research.intro} />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {researchInterests.map((interest, index) => {
            const theme = themeClasses[interest.theme]
            const text = t.research.items[interest.id]
            return (
              <Reveal key={interest.id} delay={index * 80} className="flex flex-col rounded-[1.75rem] border-2 border-ink bg-cream p-6">
                <span className={`mb-10 flex size-11 items-center justify-center rounded-full border-2 border-ink font-mono text-sm font-semibold ${theme.bg} ${theme.text}`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-2xl font-bold leading-tight tracking-tight hyphens-auto">{text.title}</h3>
                <p className="mt-3 text-ink/70">{text.description}</p>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="mt-10 flex flex-col gap-6 rounded-[1.75rem] bg-ink p-8 text-cream sm:p-10 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl font-serif text-3xl leading-tight italic sm:text-4xl">{t.research.intersection}</p>
          <FlaskConical className="size-14 shrink-0 text-lime" strokeWidth={1.5} aria-hidden="true" />
        </Reveal>

        {academicProjects.length > 0 && (
          <div className="mt-14">
            <h3 className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-ink/75">{t.research.academicTitle}</h3>
            <ul className="grid gap-4">
              {academicProjects.map((project) => {
                const text = t.research.academicItems[project.id]
                return (
                  <Reveal as="li" key={project.id} className="grid gap-6 rounded-[1.75rem] border-2 border-ink bg-cream p-6 sm:p-8 md:grid-cols-12 md:items-center">
                    <span className="flex size-14 items-center justify-center rounded-2xl border-2 border-ink bg-orange md:col-span-1">
                      <HeartPulse className="size-6" aria-hidden="true" />
                    </span>
                    <div className="md:col-span-8">
                      <h4 className="font-display text-2xl leading-tight font-bold tracking-tight text-balance">{text.title}</h4>
                      <p className="mt-2 text-ink/75">{text.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 md:col-span-3 md:justify-end">
                      {project.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </div>
                  </Reveal>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
