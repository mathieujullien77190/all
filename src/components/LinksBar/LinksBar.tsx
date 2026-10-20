import type { LinkItem, Resource, Tool } from '../../types'

interface Props {
  links: LinkItem[]
  resources: Resource[]
  tools: Tool[]
  onTool: (id: string) => void
  onOpenRoot: (target: 'explorer' | 'code' | 'terminal') => void
}

const chip = 'rounded-md border border-slate-700 px-3 py-1.5 text-sm hover:border-sky-500 hover:text-sky-300'

export function LinksBar({ links, resources, tools, onTool, onOpenRoot }: Props) {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {links.map((l) => (
          <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className={chip}>
            {l.label} ↗
          </a>
        ))}
        {tools.map((t) => (
          <button
            key={t.id}
            disabled={!t.available}
            onClick={() => onTool(t.id)}
            className={`${chip} disabled:cursor-not-allowed disabled:opacity-40`}
            title={t.available ? 'Lance l’application locale' : 'Introuvable'}
          >
            ▶ {t.label}
          </button>
        ))}
        <button onClick={() => onOpenRoot('explorer')} className={chip}>
          📁 Dossier projets
        </button>
        <button onClick={() => onOpenRoot('code')} className={chip}>
          VS Code
        </button>
        <button onClick={() => onOpenRoot('terminal')} className={chip}>
          Terminal
        </button>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
        {resources.map((r) => (
          <a key={r.id} href={r.url} target="_blank" rel="noreferrer" className="hover:text-sky-300" title={r.note}>
            <span className="uppercase text-slate-500">{r.kind}</span> {r.label}
          </a>
        ))}
      </div>
    </section>
  )
}
