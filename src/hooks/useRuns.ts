import { useCallback, useEffect, useState } from 'react'
import { IS_STATIC, RUNS_POLL_MS } from '@/constants'
import { api } from '@/helpers'
import type { Run } from '@/types'

export const useRuns = () => {
  const [runs, setRuns] = useState<Run[]>([])

  const refresh = useCallback(() => api.runs().then(setRuns).catch(() => {}), [])

  useEffect(() => {
    if (IS_STATIC) return
    refresh()
    const timer = setInterval(refresh, RUNS_POLL_MS)
    return () => clearInterval(timer)
  }, [refresh])

  return { runs, refresh }
}
