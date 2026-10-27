import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import useI18n from '../hooks/useI18n.js'

// Scrolls to the hash target after navigation (e.g. "/#contact" from a solution page),
// or to the top when only the path changes.
function useScrollManagement() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return undefined
    }
    // Wait a frame so the target section exists after a route change.
    const frame = requestAnimationFrame(() => {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])
}

export default function SiteLayout() {
  const { t } = useI18n()
  useScrollManagement()

  return (
    <div id="top" className="flex min-h-svh flex-col overflow-x-clip">
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-ink px-4 py-2 text-cream focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {t.nav.skip}
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
