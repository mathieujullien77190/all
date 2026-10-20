import type { ProjectFilter } from '@/types'

export type FiltersProps = {
  filter: ProjectFilter
  onFilterChange: (filter: ProjectFilter) => void
  count: number
  message: string | null
}
