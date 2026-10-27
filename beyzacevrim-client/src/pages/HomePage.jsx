import usePageMeta from '../hooks/usePageMeta.js'
import About from '../sections/About.jsx'
import Contact from '../sections/Contact.jsx'
import Hero from '../sections/Hero.jsx'
import Research from '../sections/Research.jsx'
import Solutions from '../sections/Solutions.jsx'
import Stack from '../sections/Stack.jsx'
import TerminalSection from '../sections/TerminalSection.jsx'

// What a visiting client needs comes first; the more technical extras follow before contact.
export default function HomePage() {
  usePageMeta()

  return (
    <>
      <Hero />
      <Solutions />
      <About />
      <Stack />
      <Research />
      <TerminalSection />
      <Contact />
    </>
  )
}
