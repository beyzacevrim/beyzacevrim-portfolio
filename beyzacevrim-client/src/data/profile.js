// Language-independent profile data. Translatable text lives in src/i18n/locales.

export const profile = {
  name: 'Beyza Çevrim',
  firstName: 'Beyza',
  // Public contact links. Entries left empty are not rendered.
  links: {
    email: 'beyzacevrim1907@gmail.com',
    github: 'https://github.com/beyzacevrim',
    linkedin: 'https://www.linkedin.com/in/beyzacevrim',
  },
}

// Shows a URL without protocol and "www." (e.g. linkedin.com/in/…).
const shortUrl = (url) => url.replace(/^https?:\/\/(www\.)?/, '')

// Labels come from t.contact.linkLabels[key].
export const contactLinks = [
  { key: 'email', href: profile.links.email && `mailto:${profile.links.email}`, display: profile.links.email },
  { key: 'github', href: profile.links.github, display: shortUrl(profile.links.github) },
  { key: 'linkedin', href: profile.links.linkedin, display: shortUrl(profile.links.linkedin) },
].filter((link) => link.href)
