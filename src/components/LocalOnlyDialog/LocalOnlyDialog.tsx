import { useEffect, useRef } from 'react'
import Button from '@/components/ui/Button'
import { DIALOG_CLOSE_LABEL, DIALOG_INTRO, DIALOG_STEPS, DIALOG_TITLE } from './constants'
import type { LocalOnlyDialogProps } from './types'

export const LocalOnlyDialog = ({ open, onClose }: LocalOnlyDialogProps) => {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="m-auto w-[min(32rem,calc(100%-2rem))] rounded-lg border border-slate-700 bg-slate-900 p-0 text-slate-200 backdrop:bg-black/60"
    >
      <div className="space-y-4 p-5">
        <h2 className="text-lg font-semibold text-slate-100">{DIALOG_TITLE}</h2>
        <p className="text-sm text-slate-400">{DIALOG_INTRO}</p>
        <pre className="overflow-x-auto rounded bg-slate-950 p-3 text-xs text-sky-300">{DIALOG_STEPS.join('\n')}</pre>
        <div className="flex justify-end">
          <Button size="md" tone="active" onClick={onClose}>
            {DIALOG_CLOSE_LABEL}
          </Button>
        </div>
      </div>
    </dialog>
  )
}
