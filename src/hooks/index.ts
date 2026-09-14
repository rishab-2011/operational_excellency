import { useCallback, useEffect, useRef, useState } from 'react'

/** Honours prefers-reduced-motion, and keeps honouring it if the user changes it live. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const on = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(query)
    setMatches(mq.matches)
    const on = (e: MediaQueryListEvent) => setMatches(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return matches
}

/** Reveal-on-scroll. Fires once, then disconnects. */
export function useInView<T extends HTMLElement>(rootMargin = '-12% 0px -8% 0px') {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') { setInView(true); return }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect() } },
      { rootMargin, threshold: 0.01 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])
  return { ref, inView }
}

/** Tracks which section occupies the reading position, for nav state. */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '')
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const seen = new Map<string, number>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.intersectionRatio)
        let best = ''
        let bestRatio = 0
        for (const [id, ratio] of seen) if (ratio > bestRatio) { bestRatio = ratio; best = id }
        if (best && bestRatio > 0) setActive(best)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    )
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids])
  return active
}

/** 0→1 progress through the document, for the reading indicator. */
export function useScrollProgress(): number {
  const [p, setP] = useState(0)
  useEffect(() => {
    let frame = 0
    const on = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight
        setP(h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0)
      })
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
    }
  }, [])
  return p
}

/** Roving-index keyboard support for horizontal/vertical option groups. */
export function useRovingIndex(count: number, onSelect: (i: number) => void) {
  return useCallback(
    (e: React.KeyboardEvent, current: number) => {
      const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End']
      if (!keys.includes(e.key)) return
      e.preventDefault()
      let next = current
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (current + 1) % count
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (current - 1 + count) % count
      if (e.key === 'Home') next = 0
      if (e.key === 'End') next = count - 1
      onSelect(next)
    },
    [count, onSelect],
  )
}
