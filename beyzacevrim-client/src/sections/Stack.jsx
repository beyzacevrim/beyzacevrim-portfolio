import Reveal from '../components/Reveal.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { themeClasses } from '../data/site.js'
import { stackGroups } from '../data/stack.js'
import useI18n from '../hooks/useI18n.js'
import { term } from '../i18n/format.js'

// Bento layout: each group gets a span that suits its size.
const SPANS = {
  frontend: 'md:col-span-4 md:row-span-2',
  backend: 'md:col-span-2 md:row-span-2',
  data: 'md:col-span-2',
  tooling: 'md:col-span-2',
  dotnet: 'md:col-span-2',
}

export default function Stack() {
  const { t } = useI18n()

  return (
    <section id="stack" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
      <SectionHeader index="03" eyebrow={t.stack.eyebrow} title={t.stack.title} intro={t.stack.intro} />

      <div className="mt-14 grid auto-rows-[minmax(10rem,auto)] gap-4 md:grid-cols-6">
        {stackGroups.map((group, index) => {
          const theme = themeClasses[group.theme]
          const large = group.id === 'frontend'
          return (
            <Reveal
              key={group.id}
              delay={index * 70}
              className={`grain flex flex-col justify-between gap-6 rounded-[1.75rem] border-2 border-ink p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-8 ${theme.bg} ${theme.text} ${SPANS[group.id]}`}
            >
              <h3 className={`font-display font-bold tracking-tight ${large ? 'text-4xl sm:text-5xl' : 'text-2xl'}`}>
                {t.stack.groups[group.id]}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className={`rounded-full border-2 border-current px-3.5 py-1.5 font-medium ${large ? 'text-base sm:text-lg' : 'text-sm'}`}
                  >
                    {term(t, item)}
                  </li>
                ))}
              </ul>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
