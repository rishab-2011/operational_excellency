import { useEffect } from 'react'
import { AppShell, AreaHeader } from '@/app/AppShell'
import { areas } from '@/app/routes'
import { useRoute } from '@/hooks/useRoute'
import { Overview } from '@/screens/Overview'
import { OperatingModel, operatingModelViews } from '@/screens/OperatingModel'
import { Authority, authorityViews } from '@/screens/Authority'
import { Value, valueViews } from '@/screens/Value'
import { Assess } from '@/screens/Assess'
import { Evidence, evidenceViews } from '@/screens/Evidence'

const VIEWS: Record<string, { id: string; label: string }[]> = {
  'operating-model': operatingModelViews,
  authority: authorityViews,
  value: valueViews,
  evidence: evidenceViews,
}

export default function App() {
  const { route, navigate } = useRoute()
  const area = areas.find((a) => a.id === route.area)!
  const views = VIEWS[area.id]
  const view = views ? (views.some((v) => v.id === route.view) ? route.view! : views[0].id) : ''

  // Keep the document title in step with the screen, as a product would.
  useEffect(() => {
    const label = views?.find((v) => v.id === view)?.label
    document.title = `${area.label}${label && views && views.length > 1 ? ` · ${label}` : ''} — The Operating Standard`
  }, [area.label, view, views])

  return (
    <AppShell route={route} navigate={navigate}>
      {area.id !== 'overview' && (
        <AreaHeader
          title={area.label}
          summary={area.summary}
          views={views}
          active={view}
          onSelect={(v) => navigate(area.id, v)}
        />
      )}

      {area.id === 'overview' && <Overview navigate={navigate} />}
      {area.id === 'operating-model' && <OperatingModel view={view} />}
      {area.id === 'authority' && <Authority view={view} />}
      {area.id === 'value' && <Value view={view} />}
      {area.id === 'assess' && <Assess />}
      {area.id === 'evidence' && <Evidence view={view} />}
    </AppShell>
  )
}
