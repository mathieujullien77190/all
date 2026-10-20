import type { OpenTarget, ProjectsPayload, Run } from '../types'

async function request<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: body === undefined ? 'GET' : 'POST',
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const json = await res.json().catch(() => ({ error: res.statusText }))
  if (!res.ok) throw new Error(json.error ?? res.statusText)
  return json as T
}

export const api = {
  projects: () => request<ProjectsPayload>('/api/projects'),
  runs: () => request<Run[]>('/api/runs'),
  run: (project: string, pkg: string, script: string) => request('/api/run', { project, pkg, script }),
  stop: (id: string) => request('/api/stop', { id }),
  open: (project: string | null, target: OpenTarget) => request('/api/open', { project, target }),
  tool: (tool: string) => request<{ withConnection?: boolean }>('/api/tool', { tool }),
}

export const repoUrl = (github: string, repo: string) => `https://github.com/${github}/${repo}`
