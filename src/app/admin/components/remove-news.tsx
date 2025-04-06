'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Trash } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { SupabaseNews } from '@/types/news'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

const deleteNews = async (id: string) => {
  const { error } = await supabase.from('news').delete().eq('id', id)

  if (error) {
    throw error
  }

  return id
}

interface RemoveNewsProps {
  newsItem: SupabaseNews
  onSuccess?: () => void
}

export const RemoveNews = ({ newsItem, onSuccess }: RemoveNewsProps) => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: deleteNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] })
      setOpen(false)
      toast.success('News deleted successfully!')
      if (onSuccess) onSuccess()
    },
    onError: (error: any) => {
      toast.error(error.message ? error.message : 'Something went wrong, try again')
    }
  })

  const handleDelete = () => {
    deleteMutation.mutate(newsItem.id)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='hover:bg-destructive hover:text-background flex items-center gap-1'
        >
          <Trash className='h-4 w-4' />
          <span>Remove</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the news
            article from your database.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className='mt-6'>
          <Button
            variant='outline'
            onClick={() => setOpen(false)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            className='w-20'
            variant='destructive'
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <Loader2 className='animate-spin' />
            ) : (
              'Delete'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
