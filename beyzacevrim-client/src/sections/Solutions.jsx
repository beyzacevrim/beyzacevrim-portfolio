import Reveal from '../components/Reveal.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import SolutionCard from '../components/SolutionCard.jsx'
import { solutions } from '../data/solutions.js'
import useI18n from '../hooks/useI18n.js'

// Alternating wide/narrow columns give the grid its asymmetric, editorial rhythm.
const LAYOUT = ['md:col-span-7', 'md:col-span-5 md:mt-32', 'md:col-span-5 md:-mt-12', 'md:col-span-7 md:mt-16']

export default function Solutions() {
  const { t } = useI18n()

  return (
    <section id="solutions" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
      <SectionHeader index="01" eyebrow={t.solutions.eyebrow} title={t.solutions.title} intro={t.solutions.intro} />

      <div className="mt-16 grid gap-x-10 gap-y-16 md:grid-cols-12 lg:mt-20">
        {solutions.map((solution, index) => (
          <Reveal key={solution.slug} className={LAYOUT[index % LAYOUT.length]} delay={(index % 2) * 120}>
            <SolutionCard solution={solution} index={index} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
