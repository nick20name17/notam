'use client'

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useState } from 'react'

import { TablePagination } from './table-pagination'
import { SearchBar } from '@/components/search-bar'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { AirInfo } from '@/types/table'

interface AirTableProps {
  columns: ColumnDef<AirInfo, AirInfo>[]
  data: AirInfo[]
  page: number
  totalCount: number
  totalPages: number
}

export function AirTable({
  columns,
  data,
  page,
  totalCount,
  totalPages
}: AirTableProps) {
  const [search, setSearch] = useState('')

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'firstScrapeDate',
      desc: true
    }
  ])

  const table = useReactTable({
    data,
    columns,
    sortDescFirst: true,
    state: {
      sorting,
      globalFilter: search
    },
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setSearch
  })

  return (
    <section
      className='container mt-10'
      id='table'
    >
      <div className='flex items-center justify-between gap-5 pb-5'>
        <h1 className='text-3xl leading-none font-semibold tracking-tight transition-colors'>
          Table{' '}
          <span className='text-muted-foreground text-base'>
            (total: {totalCount} / on current page:{' '}
            {table.getFilteredRowModel().rows.length})
          </span>
        </h1>
        <SearchBar
          className='w-100'
          search={search}
          setSearch={setSearch}
        />
      </div>
      <ScrollArea className='h-150 rounded-md border'>
        <Table>
          <TableHeader className='bg-muted sticky top-0 z-10 shadow-[inset_0_-1px_0_0_var(--border)]'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        maxWidth: header.getSize(),
                        minWidth: header.getSize()
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        maxWidth: cell.column.getSize(),
                        minWidth: cell.column.getSize()
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
      <TablePagination
        currentPage={page}
        totalPages={totalPages}
      />
    </section>
  )
}
