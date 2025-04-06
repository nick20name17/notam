'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { News, SupabaseNews } from '@/types/news'
import { createClient } from '@/utils/supabase/client'

const newsSchema = z.object({
  url: z.string().url().min(1, 'News link is required')
})

type NewsFormData = z.infer<typeof newsSchema>

const fetchMicrolinkData = async (url: string) => {
  const response = await fetch(
    `https://api.microlink.io?url=${encodeURIComponent(url)}&video=false`
  )
  const data = await response.json()
  return data.data as News
}

const supabase = createClient()

const addNewsToSupabase = async (news: Omit<SupabaseNews, 'id'>) => {
  const { data, error, status, statusText } = await supabase
    .from('news')
    .insert([news])
    .select()
    .single()

  if (error) throw error

  return {
    data: data as SupabaseNews,
    responseInfo: {
      status,
      statusText,
      timestamp: new Date().toISOString()
    }
  }
}

export const AddNewsForm = () => {
  const queryClient = useQueryClient()

  const [newsItem, setNewsItem] = useState<SupabaseNews | null>(null)
  const [open, setOpen] = useState(false)

  const form = useForm<NewsFormData>({
    defaultValues: {
      url: ''
    },
    resolver: zodResolver(newsSchema)
  })

  const mutation = useMutation({
    mutationFn: async (url: string) => {
      const microlinkData = await fetchMicrolinkData(url)

      const supabaseNews: Omit<SupabaseNews, 'id'> = {
        url: microlinkData.url,
        date: microlinkData.date,
        title: microlinkData.title,
        imageurl: microlinkData.image?.url || '',
        description: microlinkData.description || ''
      }

      const response = await addNewsToSupabase(supabaseNews)

      try {
        // Use the API route instead of direct function call
        const tweetResponse = await fetch('/api/post-tweet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: {
              title: response.data.title,
              imageurl: response.data.imageurl
            }
          })
        })

        toast.success('Post on twitter succesfully!')

        if (!tweetResponse.ok) {
          const errorData = await tweetResponse.json()
          throw new Error(errorData.error || 'Failed to post tweet')
        }
      } catch (error: any) {
        toast.error(
          error.message
            ? error.message
            : 'Something went wrong posting tweet, try again'
        )
      }

      return response
    },
    onSuccess: (response) => {
      setNewsItem(response.data)
      setOpen(true)
      queryClient.invalidateQueries({ queryKey: ['news'] })
      toast.success('News added successfully!')
      form.reset()
    },
    onError: (error: any) => {
      toast.error(error.message ? error.message : 'Something went wrong, try again')
    }
  })

  const onNewsAdd = async (data: NewsFormData) => {
    mutation.mutate(data.url)
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onNewsAdd)}
          className='flex w-full items-end gap-2'
        >
          <FormField
            control={form.control}
            name='url'
            render={({ field }) => (
              <FormItem className='relative flex-1'>
                <FormLabel>News link</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Paste news link'
                    className='w-full'
                    {...field}
                    disabled={mutation.isPending}
                  />
                </FormControl>
                <FormMessage className='absolute top-[calc(100%+6px)] left-0' />
              </FormItem>
            )}
          />
          <Button
            className='w-24'
            type='submit'
            disabled={mutation.isPending}
          >
            {mutation.isPending ? <Loader2 className='animate-spin' /> : 'Add news'}
          </Button>
        </form>
      </Form>
      {newsItem && (
        <EditNewsCard
          newsItem={newsItem}
          open={open}
          setOpen={setOpen}
        />
      )}
    </>
  )
}

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
  open: boolean
  setOpen: (open: boolean) => void
}

export const EditNewsCard = ({ newsItem, open, setOpen }: EditNewsCardProps) => {
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
              disabled={updateMutation.isPending || !title.trim()}
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
