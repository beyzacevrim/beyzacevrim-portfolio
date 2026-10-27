import { Briefcase, GraduationCap, Languages, Sparkles } from 'lucide-react'
import Reveal from '../components/Reveal.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import Tag from '../components/Tag.jsx'
import { organizationName, timeline } from '../data/experience.js'
import useI18n from '../hooks/useI18n.js'
import { formatPeriod, term } from '../i18n/format.js'

const TYPE_STYLES = {
  work: { icon: Briefcase, dot: 'bg-cobalt text-cream' },
  education: { icon: GraduationCap, dot: 'bg-orange text-ink' },
  internship: { icon: Sparkles, dot: 'bg-lavender text-ink' },
}

export default function About() {
  const { t, lang } = useI18n()

  return (
    <section id="about" className="bg-cream-deep">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
        <SectionHeader index="02" eyebrow={t.about.eyebrow} title={t.about.title} />

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="space-y-5 text-lg leading-relaxed text-ink/80">
              {t.about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border-2 border-ink bg-cream p-5">
              <p className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-ink/75">
                <Languages className="size-4" aria-hidden="true" />
                {t.about.spokenTitle}
              </p>
              <ul className="space-y-1.5 font-medium">
                {t.about.spoken.map((language) => (
                  <li key={language}>{language}</li>
                ))}
              </ul>
            </div>
          </Reveal>

          <ol className="relative lg:col-span-6 lg:col-start-7" aria-label={t.about.timelineLabel}>
            <span className="absolute top-2 bottom-2 left-5 w-0.5 bg-ink/15" aria-hidden="true" />
            {timeline.map((item, index) => {
              const { icon: Icon, dot } = TYPE_STYLES[item.type]
              const text = t.timeline[item.id]
              return (
                <Reveal as="li" key={item.id} delay={index * 90} className="relative pb-10 pl-16 last:pb-0">
                  <span className={`absolute top-0 left-0 flex size-10 items-center justify-center rounded-full border-2 border-ink ${dot}`}>
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink/70">
                    {t.about.types[item.type]} · {formatPeriod(item, lang, t)}
                  </p>
                  <h3 className="mt-1.5 font-display text-2xl font-bold tracking-tight">{text.title}</h3>
                  {organizationName(item, t) && <p className="font-medium text-ink/80">{organizationName(item, t)}</p>}
                  <p className="mt-2 text-ink/70">{text.summary}</p>
                  {item.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 text-ink/70">
                      {item.tags.map((tag) => (
                        <Tag key={tag}>{term(t, tag)}</Tag>
                      ))}
                    </div>
                  )}
                </Reveal>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
