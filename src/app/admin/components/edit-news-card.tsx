'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Pencil } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SupabaseNews } from '@/types/news'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

const updateNewsTitle = async ({ id, title }: { id: string; title: string }) => {
  const { data, error } = await supabase
    .from('news')
    .update({ title })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data as SupabaseNews
}

interface EditNewsCardProps {
  newsItem: SupabaseNews
}

export const EditNewsCard = ({ newsItem }: EditNewsCardProps) => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(newsItem.title)
  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: updateNewsTitle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] })
      toast.success('News title updated successfully!')
      setOpen(false)
    },
    onError: (error: any) => {
      toast.error(error.message ? error.message : 'Something went wrong, try again')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate({ id: newsItem.id, title })
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
        >
          <Pencil />
          <span>Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit News Title</DialogTitle>
          <DialogDescription>
            Update the title of this news article.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className='space-y-4'
        >
          <div className='space-y-2'>
            <Label htmlFor='title'>Title</Label>
            <Input
              id='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Enter news title'
              disabled={updateMutation.isPending}
            />
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              className='w-28'
              type='submit'
              disabled={
                updateMutation.isPending || title === newsItem.title || !title.trim()
              }
            >
              {updateMutation.isPending ? (
                <Loader2 className='animate-spin' />
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
