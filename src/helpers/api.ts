import { API, IS_STATIC, STATIC_PROJECTS_URL } from '@/constants'
import type { OpenTarget, ProjectsPayload, Run } from '@/types'

const request = async <T>(url: string, body?: unknown): Promise<T> => {
  const res = await fetch(url, {
    method: body === undefined ? 'GET' : 'POST',
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const json = await res.json().catch(() => ({ error: res.statusText }))
  if (!res.ok) throw new Error(json.error ?? res.statusText)
  return json as T
}

// Thrown instead of calling the API on the static build, where nothing can run locally.
export class LocalOnlyError extends Error {
  constructor() {
    super('Local only')
  }
}

const local = <T>(fn: () => Promise<T>): Promise<T> => (IS_STATIC ? Promise.reject(new LocalOnlyError()) : fn())

export const api = {
  projects: (): Promise<ProjectsPayload> => request(IS_STATIC ? STATIC_PROJECTS_URL : API.projects),
  runs: (): Promise<Run[]> => (IS_STATIC ? Promise.resolve([]) : request(API.runs)),
  run: (project: string, pkg: string, script: string): Promise<unknown> => local(() => request(API.run, { project, pkg, script })),
  stop: (id: string): Promise<unknown> => local(() => request(API.stop, { id })),
  dismiss: (id: string): Promise<unknown> => local(() => request(API.dismiss, { id })),
  open: (project: string | null, target: OpenTarget): Promise<unknown> => local(() => request(API.open, { project, target })),
  tool: (tool: string): Promise<{ withConnection?: boolean }> => local(() => request(API.tool, { tool })),
}
