'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { DEFAULT_LOGIN_REDIRECT } from '@/constants/routes'
import { createClient } from '@/utils/supabase/client'

const loginSchema = z.object({
  email: z.string().email().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required')
})

type LoginPayload = z.infer<typeof loginSchema>

export const LoginForm = () => {
  const router = useRouter()

  const supabase = createClient()

  const form = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: zodResolver(loginSchema)
  })

  const loginMutation = useMutation({
    mutationFn: async (formData: LoginPayload) => {
      return supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })
    },
    onSuccess: (data) => {
      if (data.error) {
        throw new Error(data.error.message || 'Failed to login')
      }

      router.push(DEFAULT_LOGIN_REDIRECT)
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Unknown error')
    }
  })

  const onSubmit = (formData: LoginPayload) => {
    loginMutation.mutate(formData)
  }

  return (
    <Form {...form}>
      <form
        className='w-full space-y-4'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          disabled={loginMutation.isPending}
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder='example@mail.com'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={loginMutation.isPending}
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder='••••••••'
                  type='password'
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className='w-full'
          disabled={loginMutation.isPending}
          type='submit'
        >
          {loginMutation.isPending ? <Loader2 className='animate-spin' /> : 'Login'}
        </Button>
      </form>
    </Form>
  )
}
