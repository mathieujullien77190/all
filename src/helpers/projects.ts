import { GITHUB_BASE_URL, RUN_ID_SEPARATOR } from '@/constants'
import type { Project, ProjectFilter, Run } from '@/types'

export const repoUrl = (github: string, repo: string): string => `${GITHUB_BASE_URL}/${github}/${repo}`

export const runId = (project: string, pkg: string, script: string): string =>
  [project, pkg, script].join(RUN_ID_SEPARATOR)

export const findRun = (runs: Run[], project: string, pkg: string, script: string): Run | undefined =>
  runs.find((r) => r.id === runId(project, pkg, script))

export const filterProjects = (projects: Project[], query: string, filter: ProjectFilter): Project[] => {
  const q = query.trim().toLowerCase()
  return projects.filter((p) => {
    if (filter === 'cloned' && !p.exists) return false
    if (filter === 'remote' && p.exists) return false
    return !q || [p.name, p.description, ...p.tags].some((s) => s.toLowerCase().includes(q))
  })
}

export const serviceName = (label: string): string => label.split(' - ')[0].toLowerCase()

export const displayUrl = (url: string): string => url.replace(/^https?:\/\//, '')
