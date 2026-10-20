import type { Run } from '@/types'

export type ScriptButtonProps = {
  label: string
  title?: string
  run?: Run
  onRun: () => void
  onStop: (runId: string) => void
}
