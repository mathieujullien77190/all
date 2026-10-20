import { useCallback, useEffect, useState } from 'react'
import { api } from '../helpers'
import type { ProjectsPayload } from '../types'

export function useProjects() {
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
  }, [reload])

  return { data, error, reload }
}
