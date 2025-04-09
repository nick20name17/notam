import Link from 'next/link'

import { Button } from '@/components/ui/button'

export const GoogleForm = () => {
  return (
    <section
      className='container mt-20 border-b pb-5'
      id='form'
    >
      <h2 className='text-3xl leading-none font-semibold tracking-tight transition-colors'>
        Google form
      </h2>
      <Link
        className='mt-3 block'
        href='https://docs.google.com/forms/d/e/1FAIpQLSdDHNLpCmB-Q5kkR81fxAtBlH76gw_kur5xDNt0IvZqEB2z9Q/viewform'
        target='_blank'
      >
        <Button>Leave a complaint</Button>
      </Link>
    </section>
  )
}
