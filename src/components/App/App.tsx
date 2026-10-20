import { useMemo, useState } from 'react'
import Filters from '@/components/Filters'
import LinksBar from '@/components/LinksBar'
import ProjectCard from '@/components/ProjectCard'
import RunsPanel from '@/components/RunsPanel'
import { api, filterProjects } from '@/helpers'
import { useProjects, useRuns } from '@/hooks'
import type { ProjectFilter } from '@/types'
import { LOADING_TEXT, OFFLINE_TEXT, TOOL_LAUNCH_TEXT } from './constants'

export const App = () => {
  const { data, error, reload } = useProjects()
  const runs = useRuns()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<ProjectFilter>('all')
  const [message, setMessage] = useState<string | null>(null)

  const projects = useMemo(() => filterProjects(data?.projects ?? [], query, filter), [data, query, filter])

  const act = (fn: () => Promise<unknown>, done?: string) =>
    fn()
      .then(() => setMessage(done ?? null))
      .catch((err: Error) => setMessage(err.message))
      .finally(reload)

  if (error && !data) {
    return (
      <main className="mx-auto max-w-xl p-8 text-center">
        <p className="text-red-300">
          {OFFLINE_TEXT} : {error}
        </p>
        <p className="mt-2 text-sm text-slate-400">
          Lance <code className="rounded bg-slate-800 px-1">npm run dev</code> (front + API).
        </p>
      </main>
    )
  }
  if (!data) return <main className="p-8 text-slate-400">{LOADING_TEXT}</main>

  return (
    <div className="flex items-start">
      <main className="mx-auto min-w-0 max-w-7xl flex-1 space-y-6 px-4 py-6">
        <header className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-2xl font-bold text-slate-100">Mes projets</h1>
          <span className="text-xs text-slate-500">{data.root}</span>
        </header>

        <LinksBar
          links={data.links}
          resources={data.resources}
          tools={data.tools}
          onTool={(id) => act(() => api.tool(id), TOOL_LAUNCH_TEXT)}
          onOpenRoot={(target) => act(() => api.open(null, target))}
        />

        <Filters
          query={query}
          onQueryChange={setQuery}
          filter={filter}
          onFilterChange={setFilter}
          count={projects.length}
          message={message}
        />

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
      </main>
      <RunsPanel runs={runs} onStop={(id) => act(() => api.stop(id))} />
    </div>
  )
}
