import LinkRow from '@/components/LinkRow'
import PackageScripts from '@/components/PackageScripts'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import { OPEN_ACTIONS } from '@/constants'
import { repoUrl, serviceName } from '@/helpers'
import { REMOTE_ONLY_LABEL } from './constants'
import type { ProjectCardProps } from './types'

export const ProjectCard = ({ project, github, resources, runs, onRun, onStop, onOpen }: ProjectCardProps) => (
  <Card>
    <header className="space-y-1">
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-semibold text-slate-100">{project.name}</h2>
        {!project.local && <span className="text-xs text-amber-400">{REMOTE_ONLY_LABEL}</span>}
      </div>
      <p className="text-sm text-slate-400">{project.description}</p>
      <div className="flex flex-wrap gap-1">
        {project.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
    </header>

    <dl className="space-y-0.5 text-xs">
      {project.repo && <LinkRow name="repo" url={repoUrl(github, project.repo)} />}
      {project.live.map((url) => (
        <LinkRow key={url} name="live" url={url} />
      ))}
      {resources
        .filter((r) => project.resources.includes(r.id))
        .map((r) => (
          <LinkRow key={r.id} name={serviceName(r.label)} url={r.url} title={r.note} />
        ))}
    </dl>

    {project.exists && (
      <div className="flex flex-wrap gap-2">
        {OPEN_ACTIONS.map(({ target, label }) => (
          <Button key={target} onClick={() => onOpen(project.id, target)}>
            {label}
          </Button>
        ))}
      </div>
    )}

    {project.packages.map((pkg) => (
      <PackageScripts key={pkg.path} projectId={project.id} pkg={pkg} runs={runs} onRun={onRun} onStop={onStop} />
    ))}
  </Card>
)
