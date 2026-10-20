export interface LinkItem {
  label: string
  url: string
}

export interface Resource {
  id: string
  label: string
  kind: 'database' | 'hosting' | 'backend' | 'repo' | 'tool'
  url: string
  note?: string
}

export interface PackageInfo {
  path: string
  label: string
  name?: string
  scripts: Record<string, string>
  installed: boolean
}

export interface Project {
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

export interface Tool {
  id: string
  label: string
  available: boolean
}

export interface ProjectsPayload {
  github: string
  root: string
  links: LinkItem[]
  resources: Resource[]
  tools: Tool[]
  projects: Project[]
}

export interface Run {
  id: string
  project: string
  pkg: string
  script: string
  status: 'running' | 'exited'
  code: number | null
  pid: number | null
  startedAt: number
  log: string[]
}

export type OpenTarget = 'explorer' | 'code' | 'terminal'
