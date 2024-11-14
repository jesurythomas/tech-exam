import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
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

interface SignInFormData {
  email: string
  password: string
}

export function SignInForm() {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<SignInFormData>()
  const signIn = useAuthStore((state) => state.login)
  const navigate = useNavigate()
  
  const onSubmit = async (data: SignInFormData) => {
    try {
      await signIn(data.email, data.password)
      navigate('/contacts')
    } catch (error) {
      console.log(error)
      setError('root', {
        type: 'manual',
        message:'Invalid credentials or inactive account'
      })
    }
  }

  return (
    <div className="flex items-center justify-center">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Sign in to manage your contacts</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errors.root && (
              <div className="text-red-500 text-sm">{errors.root.message}</div>
            )}
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
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 