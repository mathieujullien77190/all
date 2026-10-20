import { ROOT_PACKAGE_PATH } from '@/constants'
import type { Run } from '@/types'
import { DEFAULT_WIDTH, MAX_WIDTH_RATIO, MIN_WIDTH, WIDTH_STORAGE_KEY } from './constants'

export const runLabel = (run: Run): string =>
  `${run.project}${run.pkg === ROOT_PACKAGE_PATH ? '' : `/${run.pkg}`} · ${run.script}`

export const runIcon = (run: Run): string => {
  if (run.status === 'running') return '●'
  if (run.stopped) return '■'
  return run.code === 0 ? '✓' : '✗'
}

export const clampWidth = (width: number, viewport: number): number =>
  Math.min(Math.max(width, MIN_WIDTH), Math.max(MIN_WIDTH, viewport * MAX_WIDTH_RATIO))

export const readStoredWidth = (): number => {
  try {
    const stored = Number(localStorage.getItem(WIDTH_STORAGE_KEY))
    return stored > 0 ? stored : DEFAULT_WIDTH
  } catch {
    return DEFAULT_WIDTH
  }
}

export const storeWidth = (width: number): void => {
  try {
    localStorage.setItem(WIDTH_STORAGE_KEY, String(Math.round(width)))
  } catch {
    // storage unavailable: width just won't persist
  }
}
