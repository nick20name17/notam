'use client'

import { formatDistanceToNow } from 'date-fns'
import { ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { SupabaseNews } from '@/types/news'

export const NewsCard = ({ news }: { news: SupabaseNews }) => {
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
      <CardFooter className='border-t'>
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
