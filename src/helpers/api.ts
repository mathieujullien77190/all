import { API } from '@/constants'
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

export const api = {
  projects: (): Promise<ProjectsPayload> => request(API.projects),
  runs: (): Promise<Run[]> => request(API.runs),
  run: (project: string, pkg: string, script: string): Promise<unknown> => request(API.run, { project, pkg, script }),
  stop: (id: string): Promise<unknown> => request(API.stop, { id }),
  dismiss: (id: string): Promise<unknown> => request(API.dismiss, { id }),
  open: (project: string | null, target: OpenTarget): Promise<unknown> => request(API.open, { project, target }),
  tool: (tool: string): Promise<{ withConnection?: boolean }> => request(API.tool, { tool }),
}
