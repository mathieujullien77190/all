import type { Run } from '@/types'

export type RunsPanelProps = {
  runs: Run[]
  onStop: (runId: string) => void
}
