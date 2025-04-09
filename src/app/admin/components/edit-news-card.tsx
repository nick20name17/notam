'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Pencil } from 'lucide-react'
import Link from 'next/link'
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
  DialogTitle,
  DialogTrigger
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
import { SupabaseNews } from '@/types/news'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

const updateNewsTitle = async ({
  id,
  title,
  description,
  imageurl
}: {
  id: string
  title: string
  description: string
  imageurl: string
}) => {
  const { data, error } = await supabase
    .from('news')
    .update({ title, description, imageurl })
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

const editNewsCardSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required').optional(),
  imageurl: z.string().url('Please enter a valid URL').optional().or(z.literal(''))
})

type FormValues = z.infer<typeof editNewsCardSchema>

interface EditNewsCardProps {
  newsItem: SupabaseNews
  open?: boolean
  setOpen?: (open: boolean) => void
  hideButton?: boolean
}

export const EditNewsCard = ({
  newsItem,
  open: externalOpen,
  setOpen: externalSetOpen,
  hideButton = false
}: EditNewsCardProps) => {
  const [internalOpen, setInternalOpen] = useState(false)

  const open = externalOpen !== undefined ? externalOpen : internalOpen
  const setOpen = externalSetOpen || setInternalOpen

  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(editNewsCardSchema),
    defaultValues: {
      title: newsItem.title,
      description: newsItem.description || '',
      imageurl: newsItem.imageurl || ''
    }
  })

  const updateMutation = useMutation({
    mutationFn: updateNewsTitle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] })
      toast.success('News item updated successfully!')
      setOpen(false)
      form.reset()
    },
    onError: (error: any) => {
      toast.error(error.message ? error.message : 'Something went wrong, try again')
    }
  })

  const onSubmit = (values: FormValues) => {
    updateMutation.mutate({
      id: newsItem.id,
      title: values.title,
      description: values.description ?? '',
      imageurl: values.imageurl ?? ''
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) {
          form.reset({
            title: newsItem.title,
            description: newsItem.description || '',
            imageurl: newsItem.imageurl || ''
          })
        }
      }}
    >
      {!hideButton && (
        <DialogTrigger asChild>
          <Button
            variant='outline'
            size='sm'
          >
            <Pencil />
            <span>Edit</span>
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit News Item</DialogTitle>
          <DialogDescription>
            Update the details of this news article.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter news title'
                      disabled={updateMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {newsItem.description !== undefined && (
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter news description'
                        disabled={updateMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {newsItem.imageurl !== undefined && (
              <FormField
                control={form.control}
                name='imageurl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter image URL (optional)'
                        disabled={updateMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className='flex-col sm:justify-between'>
              <Link
                className='block max-sm:w-full'
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(newsItem.url)}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <Button
                  className='max-sm:w-full'
                  type='button'
                  variant='outline'
                  disabled={updateMutation.isPending}
                >
                  Share on Facebook
                </Button>
              </Link>
              <div className='flex items-center gap-2'>
                <Button
                  className='max-sm:flex-1'
                  type='button'
                  variant='outline'
                  onClick={() => setOpen(false)}
                  disabled={updateMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  className='w-28 max-sm:flex-1'
                  type='submit'
                  disabled={updateMutation.isPending || !form.formState.isValid}
                >
                  {updateMutation.isPending ? (
                    <Loader2 className='size-4 animate-spin' />
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
