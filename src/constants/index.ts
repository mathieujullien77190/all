import type { OpenTarget } from '@/types'

export const API = {
  projects: '/api/projects',
  runs: '/api/runs',
  run: '/api/run',
  stop: '/api/stop',
  dismiss: '/api/dismiss',
  open: '/api/open',
  tool: '/api/tool',
} as const

// GitHub Pages build (vite --mode pages): no local API, data comes from a static snapshot.
export const IS_STATIC = import.meta.env.MODE === 'pages'
export const STATIC_PROJECTS_URL = `${import.meta.env.BASE_URL}projects.static.json`

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
  { target: 'claude', label: 'Claude' },
]
