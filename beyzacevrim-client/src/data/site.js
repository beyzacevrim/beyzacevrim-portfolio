// Section ids used for navigation. Labels live in t.nav[id].
// The header keeps to what a visiting client needs; the footer lists every section.
export const navItems = ['solutions', 'about', 'contact']
export const footerItems = ['solutions', 'about', 'stack', 'research', 'terminal', 'contact']

// Tailwind classes per color theme. Written out in full so Tailwind can detect them.
export const themeClasses = {
  cobalt: { bg: 'bg-cobalt', text: 'text-cream', soft: 'bg-cobalt/10', accent: 'bg-lime', border: 'border-cobalt' },
  orange: { bg: 'bg-orange', text: 'text-ink', soft: 'bg-orange/15', accent: 'bg-cobalt', border: 'border-orange' },
  lime: { bg: 'bg-lime', text: 'text-ink', soft: 'bg-lime/30', accent: 'bg-orange', border: 'border-lime' },
  lavender: { bg: 'bg-lavender', text: 'text-ink', soft: 'bg-lavender/30', accent: 'bg-cobalt', border: 'border-lavender' },
  cream: { bg: 'bg-cream-deep', text: 'text-ink', soft: 'bg-cream-deep', accent: 'bg-orange', border: 'border-ink' },
}
