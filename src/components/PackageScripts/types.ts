import type { PackageInfo, Run } from '@/types'

export type PackageScriptsProps = {
  projectId: string
  pkg: PackageInfo
  runs: Run[]
  onRun: (project: string, pkg: string, script: string) => void
  onStop: (runId: string) => void
}
