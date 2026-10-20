import { useMemo, useState } from 'react'
import { LinksBar, ProjectCard, RunsPanel } from './components'
import { api } from './helpers'
import { useProjects, useRuns } from './hooks'
import type { OpenTarget } from './types'

type Filter = 'all' | 'local' | 'github'

export function App() {
  const { data, error, reload } = useProjects()
  const runs = useRuns()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [message, setMessage] = useState<string | null>(null)

  const projects = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (data?.projects ?? []).filter((p) => {
      if (filter === 'local' && !p.exists) return false
      if (filter === 'github' && !p.repo) return false
      return !q || [p.name, p.description, ...p.tags].some((s) => s.toLowerCase().includes(q))
    })
  }, [data, query, filter])

  const act = (fn: () => Promise<unknown>, done?: string) =>
    fn()
      .then(() => setMessage(done ?? null))
      .catch((err: Error) => setMessage(err.message))
      .finally(reload)

  if (error && !data) {
    return (
      <main className="mx-auto max-w-xl p-8 text-center">
        <p className="text-red-300">API locale injoignable : {error}</p>
        <p className="mt-2 text-sm text-slate-400">
          Lance <code className="rounded bg-slate-800 px-1">npm run dev</code> (front + API).
        </p>
      </main>
    )
  }
  if (!data) return <main className="p-8 text-slate-400">Chargement…</main>

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 pb-64 pt-6">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-bold text-slate-100">Mes projets</h1>
        <span className="text-xs text-slate-500">{data.root}</span>
      </header>

      <LinksBar
        links={data.links}
        resources={data.resources}
        tools={data.tools}
        onTool={(id) =>
          act(() => api.tool(id), 'Lancement…')
        }
        onOpenRoot={(target: OpenTarget) => act(() => api.open(null, target))}
      />

      <div className="flex flex-wrap items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher (nom, tag…)"
          className="w-64 rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm outline-none focus:border-sky-500"
        />
        {(['all', 'local', 'github'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-md border px-3 py-1.5 text-sm ${filter === f ? 'border-sky-500 text-sky-300' : 'border-slate-700 text-slate-400'}`}
          >
            {f === 'all' ? 'Tous' : f === 'local' ? 'Locaux' : 'Sur GitHub'}
          </button>
        ))}
        <span className="text-sm text-slate-500">{projects.length} projets</span>
        {message && <span className="ml-auto text-sm text-amber-300">{message}</span>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            github={data.github}
            resources={data.resources}
            runs={runs}
            onRun={(project, pkg, script) => act(() => api.run(project, pkg, script))}
            onStop={(id) => act(() => api.stop(id))}
            onOpen={(project, target) => act(() => api.open(project, target))}
          />
        ))}
      </div>

      <RunsPanel runs={runs} onStop={(id) => act(() => api.stop(id))} />
    </main>
  )
}
