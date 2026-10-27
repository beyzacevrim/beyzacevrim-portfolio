import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { profile } from '../data/profile.js'
import { navItems } from '../data/site.js'
import useI18n from '../hooks/useI18n.js'
import { plainHeadline } from '../i18n/format.js'
import LanguageSwitcher from './LanguageSwitcher.jsx'

export default function Navbar() {
  const { t } = useI18n()
  // The menu remembers the location it was opened at, so any navigation closes it.
  const location = useLocation()
  const [openAt, setOpenAt] = useState(null)
  const open = openAt === location.key
  const setOpen = (value) => setOpenAt(value ? location.key : null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return undefined
    document.body.style.overflow = 'hidden'
    const onKey = (event) => event.key === 'Escape' && setOpenAt(null)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled ? 'border-b border-ink/10 bg-cream/85 backdrop-blur-md' : 'border-b border-transparent bg-cream'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8" aria-label={t.nav.main}>
        <Link to="/" className="group flex shrink-0 items-center gap-2.5 font-display text-xl font-bold tracking-tight sm:text-2xl">
          <span className="size-3.5 rounded-full bg-orange transition-transform duration-300 group-hover:scale-150" aria-hidden="true" />
          {profile.name}
        </Link>

        <ul className="hidden items-center gap-6 text-sm font-medium lg:flex">
          {navItems.map((id) => (
            <li key={id}>
              <Link to={{ pathname: '/', hash: `#${id}` }} className="link-underline pb-0.5 whitespace-nowrap">
                {t.nav[id]}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <Link
            to={{ pathname: '/', hash: '#contact' }}
            className="hidden items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold whitespace-nowrap text-cream transition-colors hover:bg-cobalt xl:inline-flex"
          >
            {t.nav.sayHello} <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-full border border-ink/20 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="grain fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-cobalt px-5 pb-10 text-cream lg:hidden">
          <ul className="flex flex-col pt-6">
            {navItems.map((id, index) => (
              <li key={id} className="border-b border-cream/20">
                <Link
                  to={{ pathname: '/', hash: `#${id}` }}
                  className="flex items-baseline justify-between py-4 font-display text-4xl font-bold tracking-tight"
                >
                  {t.nav[id]}
                  <span className="font-mono text-xs text-lime">0{index + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 mb-3 font-mono text-xs uppercase tracking-[0.2em] text-cream">{t.nav.language}</p>
          <LanguageSwitcher variant="large" />
          <p className="mt-10 font-serif text-2xl italic text-lavender">{plainHeadline(t)}</p>
        </div>
      )}
    </header>
  )
}
