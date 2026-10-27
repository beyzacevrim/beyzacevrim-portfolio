import { ArrowUpRight } from 'lucide-react'
import ContactForm from '../components/ContactForm.jsx'
import Reveal from '../components/Reveal.jsx'
import { contactLinks } from '../data/profile.js'
import useI18n from '../hooks/useI18n.js'

export default function Contact() {
  const { t } = useI18n()

  return (
    <section id="contact" className="relative overflow-hidden bg-orange">
      <div className="pointer-events-none absolute -bottom-32 -left-24 size-96 rounded-full bg-lime" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:py-32">
        <Reveal className="lg:col-span-5">
          <p className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-ink">
            <span>06</span>
            <span className="h-px w-10 bg-current" aria-hidden="true" />
            <span>{t.contact.eyebrow}</span>
          </p>
          <h2 className="font-display text-5xl leading-[0.92] font-extrabold tracking-tight text-balance sm:text-7xl">
            {t.contact.title} <span className="font-serif font-normal italic">{t.contact.titleAccent}</span>
          </h2>
          <p className="mt-6 max-w-md text-lg text-ink">{t.contact.intro}</p>

          {contactLinks.length > 0 && (
            <ul className="mt-10 space-y-3">
              {contactLinks.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    target={link.key === 'email' ? undefined : '_blank'}
                    rel="noreferrer"
                    aria-label={`${t.contact.linkLabels[link.key]}: ${link.display}`}
                    className="group inline-flex items-center gap-2 text-lg font-semibold"
                  >
                    <span className="link-underline">{link.display}</span>
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Reveal>

        <Reveal delay={120} className="lg:col-span-6 lg:col-start-7">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  )
}
