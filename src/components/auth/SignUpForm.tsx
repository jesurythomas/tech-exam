import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuthStore } from '@/stores/useAuthStore'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'

interface SignUpFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

interface SignUpFormProps {
  onSuccess?: () => void;
  hideCard?: boolean;
}

export function SignUpForm({ onSuccess, hideCard = false }: SignUpFormProps) {
  const { register, handleSubmit, reset } = useForm<SignUpFormData>()
  const signUp = useAuthStore((state) => state.signup)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (data: SignUpFormData) => {
    try {
      if (data.password !== data.confirmPassword) {
        setError('Passwords do not match')
        return
      }

      await signUp(data)
      reset()
      toast.success('User created successfully')
      onSuccess?.()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to sign up')
      } else {
        toast.error('An unexpected error occurred ')
      }
    }
  }

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <Input
        {...register('firstName')}
        type="text"
        placeholder="First Name"
        required
      />
      <Input
        {...register('lastName')}
        type="text"
        placeholder="Last Name"
        required
      />
      <Input
        {...register('email')}
        type="email"
        placeholder="Email"
        required
      />
      <Input
        {...register('password')}
        type="password"
        placeholder="Password"
        required
      />
      <Input
        {...register('confirmPassword')}
        type="password"
        placeholder="Confirm Password"
        required
      />
      <Button type="submit" className="w-full">
        Sign Up
      </Button>
    </form>
  )

  if (hideCard) {
    return formContent
  }

  return (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Sign up to manage your contacts</CardDescription>
      </CardHeader>
      <CardContent>
        {formContent}
      </CardContent>
    </Card>
  )
} 