import type { ButtonTone, Run } from '@/types'

export const toneFor = (run?: Run): ButtonTone => {
  if (run?.stopped) return 'default'
  if (run?.status === 'running') return 'success'
  if (run?.status === 'exited' && !run.stopped && run.code !== 0) return 'danger'
  return 'default'
}
