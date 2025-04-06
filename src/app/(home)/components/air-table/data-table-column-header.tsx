import type { Column } from '@tanstack/react-table'
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>
  title: string
}

export const DataTableColumnHeader = <TData, TValue>({
  column,
  title
}: DataTableColumnHeaderProps<TData, TValue>) => {
  if (!column.getCanSort()) {
    return <div>{title}</div>
  }

  return (
    <button
      onClick={column.getToggleSortingHandler()}
      className='[&_svg]:text-muted-foreground inline-flex size-full cursor-pointer items-center gap-1 whitespace-nowrap focus-visible:outline-0 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0'
    >
      <span>{title}</span>
      {column.getIsSorted() === 'desc' ? (
        <ChevronDown />
      ) : column.getIsSorted() === 'asc' ? (
        <ChevronUp />
      ) : (
        <ChevronsUpDown />
      )}
    </button>
  )
}
