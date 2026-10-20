import type { LinkItem, OpenTarget, Tool } from '@/types'

export type LinksBarProps = {
  links: LinkItem[]
  tools: Tool[]
  onTool: (id: string) => void
  onOpenRoot: (target: OpenTarget) => void
}
