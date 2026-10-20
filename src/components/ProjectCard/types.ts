import type { OpenTarget, Project, Resource, Run } from '@/types'

export type ProjectCardProps = {
  project: Project
  github: string
  resources: Resource[]
  runs: Run[]
  onRun: (project: string, pkg: string, script: string) => void
  onStop: (runId: string) => void
  onOpen: (project: string, target: OpenTarget) => void
}
