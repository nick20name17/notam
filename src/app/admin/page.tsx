import { redirect } from 'next/navigation'

import { AddNewsForm } from './components/add-news-form'
import { NewsList } from './components/news-list'
import { createClient } from '@/utils/supabase/server'

const AdminPage = async () => {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <>
      <section className='container mt-10 flex flex-col gap-4'>
        <AddNewsForm />
        <NewsList />
      </section>
    </>
  )
}

export default AdminPage
