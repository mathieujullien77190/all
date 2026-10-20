import { GITHUB_BASE_URL, RUN_ID_SEPARATOR } from '@/constants'
import type { Run } from '@/types'

export const repoUrl = (github: string, repo: string): string => `${GITHUB_BASE_URL}/${github}/${repo}`

export const runId = (project: string, pkg: string, script: string): string =>
  [project, pkg, script].join(RUN_ID_SEPARATOR)

export const findRun = (runs: Run[], project: string, pkg: string, script: string): Run | undefined =>
  runs.find((r) => r.id === runId(project, pkg, script))

export const serviceName = (label: string): string => label.split(' - ')[0].toLowerCase()

export const displayUrl = (url: string): string => url.replace(/^https?:\/\//, '')
