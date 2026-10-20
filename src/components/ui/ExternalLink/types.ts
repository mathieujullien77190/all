import type { ComponentProps } from 'react'
import type { ButtonSize, ButtonTone } from '@/types'

export type ExternalLinkProps = ComponentProps<'a'> & {
  variant?: 'text' | 'button'
  tone?: ButtonTone
  size?: ButtonSize
}
