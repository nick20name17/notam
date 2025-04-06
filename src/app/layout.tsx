import type { Metadata } from 'next'
import { PropsWithChildren } from 'react'

import './globals.css'
import { Header } from '@/components/header'
import { TanstackQueryProvider } from '@/providers/tanstack-query-provider'

export const metadata: Metadata = {
  title: 'Notam',
  description: 'Generated by create next app',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg'
  }
}

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang='en'>
      <body className='antialiased'>
        <Header />
        <main className='pb-20'>
          <TanstackQueryProvider>{children}</TanstackQueryProvider>
        </main>
      </body>
    </html>
  )
}

export default RootLayout
