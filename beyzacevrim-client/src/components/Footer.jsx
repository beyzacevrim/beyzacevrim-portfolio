import { ArrowUp } from 'lucide-react'
import { Link } from 'react-router'
import { contactLinks, profile } from '../data/profile.js'
import { footerItems } from '../data/site.js'
import useI18n from '../hooks/useI18n.js'
import { plainHeadline } from '../i18n/format.js'

const YEAR = new Date().getFullYear()

export default function Footer() {
  const { t } = useI18n()

  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-5 pt-16 pb-8 sm:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="font-serif text-3xl italic text-lavender sm:text-4xl">{plainHeadline(t)}</p>
          </div>
          <nav className="md:col-span-3" aria-label="Footer">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-cream/50">{t.footer.explore}</p>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {footerItems.map((id) => (
                <li key={id}>
                  <Link to={{ pathname: '/', hash: `#${id}` }} className="link-underline">
                    {t.nav[id]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {contactLinks.length > 0 && (
            <div className="md:col-span-3">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-cream/50">{t.footer.elsewhere}</p>
              <ul className="space-y-2 text-sm">
                {contactLinks.map((link) => (
                  <li key={link.key}>
                    <a href={link.href} className="link-underline" target={link.key === 'email' ? undefined : '_blank'} rel="noreferrer">
                      {t.contact.linkLabels[link.key]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <p
          className="mt-16 font-display text-[clamp(3rem,13vw,11rem)] leading-[0.8] font-extrabold tracking-tighter text-cream/95"
          aria-hidden="true"
        >
          Beyza<span className="text-orange">.</span>
        </p>

        <div className="mt-8 flex flex-col gap-4 border-t border-cream/15 pt-6 text-xs text-cream/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {YEAR} {profile.name}.{' '}
            <Link to={{ pathname: '/', hash: '#contact' }} className="link-underline text-cream/80 hover:text-lime">
              {t.footer.cta}
            </Link>
          </p>
          <a href="#top" className="inline-flex items-center gap-1.5 hover:text-lime">
            {t.footer.backToTop} <ArrowUp className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  )
}
