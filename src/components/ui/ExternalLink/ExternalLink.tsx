import { buttonClass } from '@/helpers'
import type { ExternalLinkProps } from './types'

const ExternalLink = ({ variant = 'text', tone = 'default', size = 'md', className = '', ...rest }: ExternalLinkProps) => (
  <a
    target="_blank"
    rel="noreferrer"
    className={variant === 'button' ? buttonClass(tone, size, className) : `text-sky-400 hover:underline ${className}`.trim()}
    {...rest}
  />
)

export default ExternalLink
