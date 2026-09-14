import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_AREA, areaIds } from '@/app/routes'

export interface Route { area: string; view: string | null }

function parse(hash: string): Route {
  const raw = hash.replace(/^#\/?/, '')
  const [area, view] = raw.split('/')
  return {
    area: areaIds.includes(area) ? area : DEFAULT_AREA,
    view: view || null,
  }
}

/**
 * Hash routing. Deep links are real URLs so a screen can be sent to a colleague,
 * and the back button behaves as it would in any product.
 */
export function useRoute() {
  const [route, setRoute] = useState<Route>(() =>
    typeof window === 'undefined' ? { area: DEFAULT_AREA, view: null } : parse(window.location.hash),
  )

  useEffect(() => {
    const on = () => setRoute(parse(window.location.hash))
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])

  const navigate = useCallback((area: string, view?: string | null) => {
    const next = view ? `#/${area}/${view}` : `#/${area}`
    if (window.location.hash !== next) window.location.hash = next
    else setRoute(parse(next))
    // Areas are screens, not scroll positions.
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  return { route, navigate }
}
