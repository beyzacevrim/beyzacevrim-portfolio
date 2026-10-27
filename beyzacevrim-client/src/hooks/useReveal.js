import { useEffect, useRef, useState } from 'react'

// Reports when an element first scrolls into view. Used for one-time entrance transitions.
export default function useReveal({ threshold = 0.15 } = {}) {
  const ref = useRef(null)
  // Without IntersectionObserver support, content is shown immediately.
  const [visible, setVisible] = useState(() => !('IntersectionObserver' in window))

  useEffect(() => {
    const node = ref.current
    if (!node || visible) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, visible])

  return [ref, visible]
}
