import { Toaster } from 'sonner'

import { LoginForm } from './components/login-form'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const LoginPage = () => {
  return (
    <>
      <title>Login</title>
      <section className='bg-grey-200 -m-4 flex h-screen items-center justify-center'>
        <div>
          <Card className='mx-auto w-80 gap-4 p-4 shadow-none md:w-153 md:p-8'>
            <CardHeader className='text-center'>
              <CardTitle>
                <h1 className='text-2xl'>Login</h1>
              </CardTitle>
              <CardDescription>Login to get admin access</CardDescription>
            </CardHeader>
            <LoginForm />
          </Card>
        </div>
      </section>
      <Toaster richColors />
    </>
  )
}

export default LoginPage
