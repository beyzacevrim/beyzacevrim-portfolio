import { useEffect } from 'react'
import useI18n from './useI18n.js'

// Sets the document title and meta description in the active language.
export default function usePageMeta({ title, description } = {}) {
  const { t } = useI18n()

  useEffect(() => {
    document.title = title ? `${title} — Beyza Çevrim` : t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description || t.meta.description)
  }, [title, description, t])
}
