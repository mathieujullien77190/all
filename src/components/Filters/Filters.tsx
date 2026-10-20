import Button from '@/components/ui/Button'
import { PROJECT_FILTERS } from '@/constants'
import type { FiltersProps } from './types'

export const Filters = ({ query, onQueryChange, filter, onFilterChange, count, message }: FiltersProps) => (
  <div className="flex flex-wrap items-center gap-2">
    <input
      value={query}
      onChange={(e) => onQueryChange(e.target.value)}
      placeholder="Rechercher (nom, tag…)"
      className="w-64 rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm outline-none focus:border-sky-500"
    />
    {PROJECT_FILTERS.map(({ value, label }) => (
      <Button key={value} size="md" tone={filter === value ? 'active' : 'muted'} onClick={() => onFilterChange(value)}>
        {label}
      </Button>
    ))}
    <span className="text-sm text-slate-500">{count} projets</span>
    {message && <span className="ml-auto text-sm text-amber-300">{message}</span>}
  </div>
)
