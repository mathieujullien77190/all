import { useEffect, useState } from 'react'
import { RUNS_POLL_MS } from '@/constants'
import { api } from '@/helpers'
import type { Run } from '@/types'

export const useRuns = (): Run[] => {
  const [runs, setRuns] = useState<Run[]>([])

  useEffect(() => {
    const tick = () => api.runs().then(setRuns).catch(() => {})
    tick()
    const timer = setInterval(tick, RUNS_POLL_MS)
    return () => clearInterval(timer)
  }, [])

  return runs
}
