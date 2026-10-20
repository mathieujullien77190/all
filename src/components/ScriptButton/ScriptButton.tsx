import Button from '@/components/ui/Button'
import { RUN_ICONS } from './constants'
import { toneFor } from './helpers'
import type { ScriptButtonProps } from './types'

export const ScriptButton = ({ label, title, run, onRun, onStop }: ScriptButtonProps) => {
  const running = run?.status === 'running' && !run.stopped
  return (
    <Button
      title={title}
      disabled={run?.status === 'running' && run.stopped}
      tone={toneFor(run)}
      className="font-mono"
      onClick={() => (run && running ? onStop(run.id) : onRun())}
    >
      {running ? RUN_ICONS.stop : RUN_ICONS.play} {label}
    </Button>
  )
}
