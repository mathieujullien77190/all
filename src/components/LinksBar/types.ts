import type { LinkItem, OpenTarget, Resource, Tool } from '@/types'

export type LinksBarProps = {
  links: LinkItem[]
  resources: Resource[]
  tools: Tool[]
  onTool: (id: string) => void
  onOpenRoot: (target: OpenTarget) => void
}
