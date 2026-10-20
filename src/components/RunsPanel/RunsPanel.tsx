import { useEffect, useRef, useState } from 'react'
import type { Run } from '../../types'

interface Props {
  runs: Run[]
  onStop: (runId: string) => void
}

const label = (r: Run) => `${r.project}${r.pkg === '.' ? '' : `/${r.pkg}`} · ${r.script}`

export function RunsPanel({ runs, onStop }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const logRef = useRef<HTMLPreElement>(null)
  const current = runs.find((r) => r.id === selected) ?? runs[runs.length - 1]

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight })
  }, [current?.log.length, current?.id])

  if (!current) return null

  return (
    <aside className="sticky top-0 h-screen w-[28rem] shrink-0 border-l border-slate-700 bg-slate-950">
      <div className="flex h-full flex-col p-3">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
          {runs.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelected(r.id)}
              className={`rounded border px-2 py-0.5 font-mono ${r.id === current.id ? 'border-sky-500 text-sky-300' : 'border-slate-700 text-slate-400'}`}
            >
              {r.status === 'running' ? '● ' : r.stopped ? '■ ' : r.code === 0 ? '✓ ' : '✗ '}
              {label(r)}
            </button>
          ))}
          {current.status === 'running' && (
            <button onClick={() => onStop(current.id)} className="ml-auto rounded border border-red-500/60 px-2 py-0.5 text-red-300">
              stop
            </button>
          )}
        </div>
        <pre ref={logRef} className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-all rounded bg-black/60 p-2 font-mono text-xs text-slate-300">
          {current.log.join('\n') || '(pas de sortie)'}
        </pre>
      </div>
    </aside>
  )
}
