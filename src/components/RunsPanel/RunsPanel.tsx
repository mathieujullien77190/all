import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import Button from '@/components/ui/Button'
import { EMPTY_LOG_TEXT } from './constants'
import { clampWidth, readStoredWidth, runIcon, runLabel, storeWidth } from './helpers'
import type { RunsPanelProps } from './types'

export const RunsPanel = ({ runs, onStop }: RunsPanelProps) => {
  const [selected, setSelected] = useState<string | null>(null)
  const [width, setWidth] = useState(readStoredWidth)
  const [dragging, setDragging] = useState(false)

  const startDrag = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
  }
  const drag = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging) setWidth(clampWidth(window.innerWidth - e.clientX, window.innerWidth))
  }
  const endDrag = () => {
    setDragging(false)
    storeWidth(width)
  }
  const logRef = useRef<HTMLPreElement>(null)
  const current = runs.find((r) => r.id === selected) ?? runs[runs.length - 1]

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight })
  }, [current?.log.length, current?.id])

  if (!current) return null

  return (
    <aside
      style={{ width: clampWidth(width, window.innerWidth) }}
      className={`sticky top-0 h-screen shrink-0 border-l border-slate-700 bg-slate-950 ${dragging ? 'select-none' : ''}`}
    >
      <div
        role="separator"
        aria-orientation="vertical"
        onPointerDown={startDrag}
        onPointerMove={drag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={`absolute inset-y-0 -left-1 z-10 w-2 cursor-col-resize touch-none hover:bg-sky-500/40 ${dragging ? 'bg-sky-500/60' : ''}`}
      />
      <div className="flex h-full flex-col p-3">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {runs.map((r) => (
            <Button key={r.id} tone={r.id === current.id ? 'active' : 'muted'} className="font-mono" onClick={() => setSelected(r.id)}>
              {runIcon(r)} {runLabel(r)}
            </Button>
          ))}
          {current.status === 'running' && !current.stopped && (
            <Button tone="danger" className="ml-auto" onClick={() => onStop(current.id)}>
              stop
            </Button>
          )}
        </div>
        <pre ref={logRef} className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-all rounded bg-black/60 p-2 font-mono text-xs text-slate-300">
          {current.log.join('\n') || EMPTY_LOG_TEXT}
        </pre>
      </div>
    </aside>
  )
}
