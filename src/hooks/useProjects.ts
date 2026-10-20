import { useCallback, useEffect, useState } from 'react'
import { IS_STATIC, PROJECTS_POLL_MS } from '@/constants'
import { api } from '@/helpers'
import type { ProjectsPayload } from '@/types'

export const useProjects = () => {
  const [data, setData] = useState<ProjectsPayload | null>(null)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(() => {
    api
      .projects()
      .then((payload) => {
        setData(payload)
        setError(null)
      })
      .catch((err: Error) => setError(err.message))
  }, [])

  useEffect(() => {
    reload()
    if (IS_STATIC) return
    const timer = setInterval(reload, PROJECTS_POLL_MS)
    window.addEventListener('focus', reload)
    return () => {
      clearInterval(timer)
      window.removeEventListener('focus', reload)
    }
  }, [reload])

  return { data, error, reload }
}
