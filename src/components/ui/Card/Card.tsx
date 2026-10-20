import type { CardProps } from './types'

const Card = ({ className = '', ...rest }: CardProps) => (
  <article className={`flex flex-col gap-3 rounded-lg border border-slate-800 bg-slate-900 p-4 ${className}`.trim()} {...rest} />
)

export default Card
