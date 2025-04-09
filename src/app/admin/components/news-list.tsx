'use client'

import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { EditNewsCard } from './edit-news-card'
import { RemoveNews } from './remove-news'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { SupabaseNews } from '@/types/news'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

const fetchNews = async () => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data as SupabaseNews[]
}

export const NewsList = () => {
  const {
    data: news,
    isLoading,
    error
  } = useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
    staleTime: 1000 * 60 * 5
  })

  if (isLoading) {
    return (
      <div className='grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={i}
            className='h-120'
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex w-full justify-center py-12'>
        <div className='text-red-500'>
          {(error as Error).message || 'Failed to load news'}
        </div>
      </div>
    )
  }

  if (!news || news.length === 0) {
    return (
      <div className='flex w-full justify-center py-12'>
        <div className='text-muted-foreground text-center'>
          <p>No news articles found.</p>
          <p className='mt-2'>Add news to see them appear here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
      {news.map((newsItem) => (
        <SupabaseNewsCard
          key={newsItem.id}
          news={newsItem}
        />
      ))}
    </div>
  )
}

const SupabaseNewsCard = ({ news }: { news: SupabaseNews }) => {
  return (
    <Card className='flex h-120 flex-col overflow-hidden pt-0'>
      <div className='relative h-60 w-full'>
        <Image
          src={news.imageurl || '/placeholder.svg'}
          alt={news.title}
          fill
          className='object-cover'
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/placeholder.svg?height=200&width=400'
          }}
        />
      </div>
      <CardContent className='flex-1'>
        <p className='text-muted-foreground text-xs'>
          {news.date
            ? formatDistanceToNow(new Date(news.date), { addSuffix: true })
            : 'Recently'}
        </p>
        <h3 className='mt-2 mb-2 line-clamp-2 text-xl leading-tight font-semibold'>
          {news.title}
        </h3>
        {news.description && (
          <p className='text-muted-foreground line-clamp-3 text-sm'>
            {news.description}
          </p>
        )}
      </CardContent>
      <CardFooter className='flex w-full items-center justify-between border-t'>
        <EditNewsCard newsItem={news} />
        <RemoveNews newsItem={news} />
        <Button
          variant='ghost'
          size='sm'
          asChild
        >
          <Link
            href={news.url}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-1'
          >
            View <ExternalLink className='ml-1 h-3 w-3' />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
