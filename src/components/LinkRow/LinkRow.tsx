import ExternalLink from '@/components/ui/ExternalLink'
import { displayUrl } from '@/helpers'
import type { LinkRowProps } from './types'

export const LinkRow = ({ name, url, title }: LinkRowProps) => (
  <div className="flex gap-1.5" title={title}>
    <dt className="shrink-0 text-slate-500">{name} :</dt>
    <dd className="min-w-0 truncate">
      <ExternalLink href={url}>{displayUrl(url)}</ExternalLink>
    </dd>
  </div>
)
