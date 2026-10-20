import { ROOT_PACKAGE_PATH } from '@/constants'
import type { Run } from '@/types'

export const runLabel = (run: Run): string =>
  `${run.project}${run.pkg === ROOT_PACKAGE_PATH ? '' : `/${run.pkg}`} · ${run.script}`

export const runIcon = (run: Run): string => {
  if (run.status === 'running') return '●'
  if (run.stopped) return '■'
  return run.code === 0 ? '✓' : '✗'
}
