export type LinkItem = {
  label: string
  url: string
}

export type Resource = {
  id: string
  label: string
  kind: 'database' | 'hosting' | 'backend' | 'repo' | 'tool'
  url: string
  note?: string
}

export type PackageInfo = {
  path: string
  label: string
  name?: string
  scripts: Record<string, string>
  installed: boolean
}

export type Project = {
  id: string
  name: string
  description: string
  tags: string[]
  repo: string | null
  live: string[]
  resources: string[]
  local: boolean
  exists: boolean
  packages: PackageInfo[]
}

export type Tool = {
  id: string
  label: string
  available: boolean
}

export type ProjectsPayload = {
  github: string
  root: string
  links: LinkItem[]
  resources: Resource[]
  tools: Tool[]
  projects: Project[]
}

export type Run = {
  id: string
  project: string
  pkg: string
  script: string
  status: 'running' | 'exited'
  stopped: boolean
  url: string | null
  code: number | null
  pid: number | null
  startedAt: number
  log: string[]
}

export type OpenTarget = 'explorer' | 'code' | 'terminal' | 'claude'

export type ButtonTone = 'default' | 'active' | 'success' | 'danger' | 'muted'

export type ButtonSize = 'sm' | 'md'
