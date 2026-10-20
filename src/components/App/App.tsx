import { useState } from 'react'
import LinksBar from '@/components/LinksBar'
import LocalOnlyDialog from '@/components/LocalOnlyDialog'
import ProjectCard from '@/components/ProjectCard'
import RunsPanel from '@/components/RunsPanel'
import { api, LocalOnlyError } from '@/helpers'
import { useProjects, useRuns } from '@/hooks'
import { APP_TITLE, LOADING_TEXT, OFFLINE_TEXT, TOOL_LAUNCH_TEXT } from './constants'

export const App = () => {
  const { data, error, reload } = useProjects()
  const { runs, refresh } = useRuns()
  const [message, setMessage] = useState<string | null>(null)
  const [localOnly, setLocalOnly] = useState(false)

  const act = (fn: () => Promise<unknown>, done?: string) =>
    fn()
      .then(() => setMessage(done ?? null))
      .catch((err: Error) => (err instanceof LocalOnlyError ? setLocalOnly(true) : setMessage(err.message)))
      .finally(() => {
        reload()
        refresh()
      })

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
          <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-100">
            <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="size-10" />
            {APP_TITLE}
          </h1>
        </header>

        <LinksBar
          links={data.links}
          tools={data.tools}
          onTool={(id) => act(() => api.tool(id), TOOL_LAUNCH_TEXT)}
          onOpenRoot={(target) => act(() => api.open(null, target))}
        />

        {message && <p className="text-sm text-amber-300">{message}</p>}

        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(360px,100%),1fr))] gap-4">
          {data.projects.map((p) => (
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
      <LocalOnlyDialog open={localOnly} onClose={() => setLocalOnly(false)} />
      <RunsPanel runs={runs} onStop={(id) => act(() => api.stop(id))} onClose={(id) => act(() => api.dismiss(id))} />
    </div>
  )
}
