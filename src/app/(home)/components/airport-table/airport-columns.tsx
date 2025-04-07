'use client'

import { ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from '../air-table/data-table-column-header'

import { AirportInfo } from '@/types/table'

export const airPortColumns: ColumnDef<AirportInfo>[] = [
  {
    accessorKey: 'location',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Location'
      />
    ),
    size: 180
  },
  {
    accessorKey: 'count',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Count'
      />
    ),
    cell: ({ row }) => row.original.count,
    size: 180
  }
]
