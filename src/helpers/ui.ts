import type { ButtonSize, ButtonTone } from '@/types'

const TONES: Record<ButtonTone, string> = {
  default: 'border-slate-700 hover:border-sky-500 hover:text-sky-300',
  active: 'border-sky-500 text-sky-300',
  success: 'border-emerald-500 text-emerald-300',
  danger: 'border-red-500/60 text-red-300',
  muted: 'border-slate-700 text-slate-400',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1.5 text-sm',
}

export const buttonClass = (tone: ButtonTone, size: ButtonSize, extra = ''): string =>
  `rounded border disabled:cursor-not-allowed disabled:opacity-40 ${SIZES[size]} ${TONES[tone]} ${extra}`.trim()
