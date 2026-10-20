import type { ProjectFilter } from '@/types'

export type FiltersProps = {
  query: string
  onQueryChange: (query: string) => void
  filter: ProjectFilter
  onFilterChange: (filter: ProjectFilter) => void
  count: number
  message: string | null
}
