import Button from '@/components/ui/Button'
import ExternalLink from '@/components/ui/ExternalLink'
import { OPEN_ACTIONS } from '@/constants'
import { TOOL_UNAVAILABLE_TITLE } from './constants'
import type { LinksBarProps } from './types'

export const LinksBar = ({ links, resources, tools, onTool, onOpenRoot }: LinksBarProps) => (
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
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
      {resources.map((r) => (
        <ExternalLink key={r.id} href={r.url} title={r.note} className="text-slate-400 hover:text-sky-300">
          <span className="uppercase text-slate-500">{r.kind}</span> {r.label}
        </ExternalLink>
      ))}
    </div>
  </section>
)
