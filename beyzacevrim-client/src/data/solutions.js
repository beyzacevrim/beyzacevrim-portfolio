// Types of digital solutions offered. Text lives in t.solutions.items[slug].
// These describe what can be built, never real client or company projects.
// `theme` selects the color pairing and `preview` the illustration in SolutionPreview.

export const solutions = [
  { slug: 'websites', theme: 'orange', preview: 'website' },
  { slug: 'web-platforms', theme: 'cobalt', preview: 'dashboard' },
  { slug: 'process-software', theme: 'lime', preview: 'checklist' },
  { slug: 'social-media-tools', theme: 'lavender', preview: 'social' },
  { slug: 'b2b-platforms', theme: 'cream', preview: 'network' },
  { slug: 'integrations', theme: 'lime', preview: 'integrations' },
]

export const getSolutionBySlug = (slug) => solutions.find((solution) => solution.slug === slug)

export const getNextSolution = (slug) => {
  const index = solutions.findIndex((solution) => solution.slug === slug)
  return solutions[(index + 1) % solutions.length]
}
