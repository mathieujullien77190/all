import type { ComponentProps } from 'react'
import type { ButtonSize, ButtonTone } from '@/types'

export type ButtonProps = ComponentProps<'button'> & {
  tone?: ButtonTone
  size?: ButtonSize
}
