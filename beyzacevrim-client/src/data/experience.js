// Professional timeline, newest first. Titles, summaries and translated organization
// names live in t.timeline[id]; `organization` here is used when the name is not translated.
// Periods are formatted per language (see formatPeriod in src/i18n/format.js).
// Technologies are kept out of the timeline to keep it client-friendly.

export const timeline = [
  {
    id: 'msc',
    type: 'education',
    kind: 'expected',
    start: '2026',
    end: '2027',
    organization: null,
    tags: [],
  },
  {
    id: 'kobizon',
    type: 'work',
    start: '2025-06',
    end: null,
    organization: 'KOBİZON Proje Danışmanlık ve Yazılım',
    tags: [],
  },
  {
    id: 'zbeu',
    type: 'education',
    kind: 'graduated',
    date: '2025-06',
    organization: null,
    tags: [],
  },
  {
    id: 'internship-2024',
    type: 'internship',
    start: '2024-08',
    end: '2024-09',
    organization: null,
    tags: [],
  },
  {
    id: 'internship-2023',
    type: 'internship',
    start: '2023-08',
    end: '2023-09',
    organization: 'KOBİZON Proje Danışmanlık ve Yazılım',
    tags: [],
  },
]

// Organization name in the active language, falling back to the language-independent one.
export const organizationName = (item, t) => t.timeline[item.id].organization ?? item.organization
