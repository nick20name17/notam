'use client'

import { ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from './data-table-column-header'
import { AirInfo } from '@/types/table'

const formatDateTime = (s: string) =>
  s.replace(/^(\d{2}\/\d{2}\/\d{4}) (\d{2})(\d{2})([A-Z]*)?$/, '$1 $2:$3')

export const airColumns: ColumnDef<AirInfo>[] = [
  {
    accessorKey: 'firstScrapeDate',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='First Scrape Date'
      />
    ),
    size: 180
  },
  {
    accessorKey: 'lastScrapeDate',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Last Scrape Date'
      />
    ),
    size: 180
  },
  {
    accessorKey: 'location',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Location'
      />
    ),
    size: 100
  },
  {
    accessorKey: 'number',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Number'
      />
    ),
    size: 120
  },
  {
    accessorKey: 'class',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Class'
      />
    ),
    size: 120,
    enableSorting: false
  },
  {
    accessorKey: 'startDate',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Start Date'
      />
    ),
    cell: ({ row }) => formatDateTime(row.original.startDate),
    size: 180
  },
  {
    accessorKey: 'endDate',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='End Date'
      />
    ),
    cell: ({ row }) => formatDateTime(row.original.endDate),
    size: 180
  },
  {
    accessorKey: 'condition',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Condition'
      />
    ),
    cell: ({ row }) => (
      <div className='whitespace-normal'>{row.original.condition}</div>
    ),
    size: 600,
    enableSorting: false
  }
]
