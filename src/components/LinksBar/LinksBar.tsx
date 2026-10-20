import Button from '@/components/ui/Button'
import ExternalLink from '@/components/ui/ExternalLink'
import { OPEN_ACTIONS } from '@/constants'
import { TOOL_UNAVAILABLE_TITLE } from './constants'
import type { LinksBarProps } from './types'

export const LinksBar = ({ links, tools, onTool, onOpenRoot }: LinksBarProps) => (
  <section className="space-y-3">
    <div className="flex flex-wrap gap-2">
      {links.map((l) => (
        <ExternalLink key={l.url} href={l.url} variant="button">
          {l.label} ↗
        </ExternalLink>
      ))}
      {tools.map((t) => (
        <Button key={t.id} size="md" disabled={!t.available} title={t.available ? undefined : TOOL_UNAVAILABLE_TITLE} onClick={() => onTool(t.id)}>
          ▶ {t.label}
        </Button>
      ))}
      {OPEN_ACTIONS.map(({ target, label }) => (
        <Button key={target} size="md" onClick={() => onOpenRoot(target)}>
          {label}
        </Button>
      ))}
    </div>
  </section>
)
