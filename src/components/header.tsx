import Image from 'next/image'
import Link from 'next/link'

import { HeaderNav } from './header-nav'

export const Header = () => {
  return (
    <header className='bg-background sticky top-0 z-20 h-16 border-b'>
      <div className='container flex h-full items-center justify-between gap-5'>
        <Link href='/'>
          <Image
            priority
            src='/logo.svg'
            width={32}
            height={32}
            alt='Notam'
          />
        </Link>
        <HeaderNav />
      </div>
    </header>
  )
}
