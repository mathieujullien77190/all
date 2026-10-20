import type { TagProps } from './types'

const Tag = ({ children }: TagProps) => (
  <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[11px] text-slate-400">{children}</span>
)

export default Tag
