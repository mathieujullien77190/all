import LinkRow from '@/components/LinkRow'
import PackageScripts from '@/components/PackageScripts'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import { IS_STATIC, OPEN_ACTIONS } from '@/constants'
import { architectureUrl, repoUrl, serviceName } from '@/helpers'
import { REMOTE_ONLY_LABEL, SELF_CARD_CLASS, SELF_PROJECT_ID, STATIC_SCRIPTS_LABEL } from './constants'
import type { ProjectCardProps } from './types'

export const ProjectCard = ({ project, github, resources, runs, onRun, onStop, onOpen }: ProjectCardProps) => (
  <Card className={project.id === SELF_PROJECT_ID ? SELF_CARD_CLASS : undefined}>
    <header className="space-y-1">
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-semibold text-slate-100">{project.name}</h2>
        {!IS_STATIC && !project.local && <span className="text-xs text-amber-400">{REMOTE_ONLY_LABEL}</span>}
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
      {project.repo && project.id !== SELF_PROJECT_ID && <LinkRow name="archi" url={architectureUrl(github, project.repo)} />}
      {project.live.map((url) => (
        <LinkRow key={url} name="live" url={url} />
      ))}
      {resources
        .filter((r) => project.resources.includes(r.id))
        .map((r) => (
          <LinkRow key={r.id} name={serviceName(r.label)} url={r.url} title={r.note} />
        ))}
    </dl>

    {(project.exists || IS_STATIC) && (
      <div className="flex flex-wrap gap-2">
        {OPEN_ACTIONS.map(({ target, label }) => (
          <Button key={target} onClick={() => onOpen(project.id, target)}>
            {label}
          </Button>
        ))}
      </div>
    )}

    {IS_STATIC && (
      <div className="border-t border-slate-800 pt-2">
        <Button onClick={() => onRun(project.id, '.', 'dev')}>{STATIC_SCRIPTS_LABEL}</Button>
      </div>
    )}

    {project.packages.map((pkg) => (
      <PackageScripts key={pkg.path} projectId={project.id} pkg={pkg} runs={runs} onRun={onRun} onStop={onStop} />
    ))}
  </Card>
)
