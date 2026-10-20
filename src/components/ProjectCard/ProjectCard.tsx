import { repoUrl } from '../../helpers'
import type { OpenTarget, PackageInfo, Project, Resource, Run } from '../../types'

interface Props {
  project: Project
  github: string
  resources: Resource[]
  runs: Run[]
  onRun: (project: string, pkg: string, script: string) => void
  onStop: (runId: string) => void
  onOpen: (project: string, target: OpenTarget) => void
}

const small = 'rounded border border-slate-700 px-2 py-0.5 text-xs hover:border-sky-500 hover:text-sky-300'

export function ProjectCard({ project, github, resources, runs, onRun, onStop, onOpen }: Props) {
  const linked = resources.filter((r) => project.resources.includes(r.id))
  const runOf = (pkg: PackageInfo, script: string) =>
    runs.find((r) => r.id === `${project.id}|${pkg.path}|${script}`)

  return (
    <article className="flex flex-col gap-3 rounded-lg border border-slate-800 bg-slate-900 p-4">
      <header className="space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-semibold text-slate-100">{project.name}</h2>
          {!project.local && <span className="text-xs text-amber-400">GitHub seul</span>}
          {project.local && !project.repo && <span className="text-xs text-slate-500">local seul</span>}
        </div>
        <p className="text-sm text-slate-400">{project.description}</p>
        <div className="flex flex-wrap gap-1">
          {project.tags.map((t) => (
            <span key={t} className="rounded bg-slate-800 px-1.5 py-0.5 text-[11px] text-slate-400">
              {t}
            </span>
          ))}
        </div>
      </header>

      <div className="flex flex-wrap gap-2 text-xs">
        {project.repo && (
          <a className={small} href={repoUrl(github, project.repo)} target="_blank" rel="noreferrer">
            repo ↗
          </a>
        )}
        {project.live.map((url) => (
          <a key={url} className={small} href={url} target="_blank" rel="noreferrer">
            live ↗
          </a>
        ))}
        {linked.map((r) => (
          <a key={r.id} className={small} href={r.url} target="_blank" rel="noreferrer" title={r.note}>
            {r.label} ↗
          </a>
        ))}
      </div>

      {project.exists && (
        <div className="flex flex-wrap gap-2 text-xs">
          <button className={small} onClick={() => onOpen(project.id, 'explorer')}>
            📁 dossier
          </button>
          <button className={small} onClick={() => onOpen(project.id, 'code')}>
            VS Code
          </button>
          <button className={small} onClick={() => onOpen(project.id, 'terminal')}>
            terminal
          </button>
        </div>
      )}

      {project.packages.map((pkg) => (
        <div key={pkg.path} className="space-y-1.5 border-t border-slate-800 pt-2">
          <div className="text-xs text-slate-500">
            {pkg.label} {!pkg.installed && <span className="text-amber-400">(deps non installees)</span>}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {!pkg.installed && <ScriptButton label="install" run={runOf(pkg, 'install')} onRun={() => onRun(project.id, pkg.path, 'install')} onStop={onStop} />}
            {Object.keys(pkg.scripts).map((script) => (
              <ScriptButton
                key={script}
                label={script}
                title={pkg.scripts[script]}
                run={runOf(pkg, script)}
                onRun={() => onRun(project.id, pkg.path, script)}
                onStop={onStop}
              />
            ))}
          </div>
        </div>
      ))}
    </article>
  )
}

interface ScriptButtonProps {
  label: string
  title?: string
  run?: Run
  onRun: () => void
  onStop: (runId: string) => void
}

function ScriptButton({ label, title, run, onRun, onStop }: ScriptButtonProps) {
  const running = run?.status === 'running'
  const failed = run?.status === 'exited' && run.code !== 0
  const tone = running
    ? 'border-emerald-500 text-emerald-300'
    : failed
      ? 'border-red-500/60 text-red-300'
      : 'border-slate-700 hover:border-sky-500 hover:text-sky-300'
  return (
    <button
      title={title}
      onClick={() => (running && run ? onStop(run.id) : onRun())}
      className={`rounded border px-2 py-0.5 font-mono text-xs ${tone}`}
    >
      {running ? '■' : '▶'} {label}
    </button>
  )
}
