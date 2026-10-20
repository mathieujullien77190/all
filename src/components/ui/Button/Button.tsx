import { buttonClass } from '@/helpers'
import type { ButtonProps } from './types'

const Button = ({ tone = 'default', size = 'sm', className, type = 'button', ...rest }: ButtonProps) => (
  <button type={type} className={buttonClass(tone, size, className)} {...rest} />
)

export default Button
