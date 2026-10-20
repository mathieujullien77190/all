import type { OpenTarget, ProjectFilter } from '@/types'

export const API = {
  projects: '/api/projects',
  runs: '/api/runs',
  run: '/api/run',
  stop: '/api/stop',
  dismiss: '/api/dismiss',
  open: '/api/open',
  tool: '/api/tool',
} as const

export const RUNS_POLL_MS = 1500
export const PROJECTS_POLL_MS = 5000
export const RUN_ID_SEPARATOR = '|'
export const ROOT_PACKAGE_PATH = '.'
export const INSTALL_SCRIPT = 'install'
export const GITHUB_BASE_URL = 'https://github.com'

export const OPEN_ACTIONS: { target: OpenTarget; label: string }[] = [
  { target: 'explorer', label: '📁 Dossier' },
  { target: 'code', label: 'VS Code' },
  { target: 'terminal', label: 'Terminal' },
]

export const PROJECT_FILTERS: { value: ProjectFilter; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'cloned', label: 'Clones' },
  { value: 'remote', label: 'GitHub seul' },
]
