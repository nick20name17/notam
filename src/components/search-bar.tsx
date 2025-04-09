import React, { Dispatch, SetStateAction } from 'react'

import { Input } from '@/components/ui/input'

interface SearchBarProps extends React.ComponentProps<'input'> {
  setSearch?: Dispatch<SetStateAction<string>>
  search?: string
}

export const SearchBar = ({ setSearch, search, ...props }: SearchBarProps) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value
    setSearch?.(searchTerm?.trim() ?? '')
  }

  return (
    <Input
      {...props}
      defaultValue={search}
      onChange={handleSearch}
      placeholder='Search...'
    />
  )
}
