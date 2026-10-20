import { useEffect, useState } from 'react'
import { api } from '../helpers'
import type { Run } from '../types'

const POLL_MS = 1500

export function useRuns() {
  const [runs, setRuns] = useState<Run[]>([])

  useEffect(() => {
    const tick = () => api.runs().then(setRuns).catch(() => {})
    tick()
    const timer = setInterval(tick, POLL_MS)
    return () => clearInterval(timer)
  }, [])

  return runs
}
