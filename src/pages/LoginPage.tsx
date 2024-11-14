import { SignInForm } from '@/components/auth/SignInForm'
import { useState } from 'react';
import { SignUpForm } from '@/components/auth/SignUpForm';

export function LoginPage() {
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="flex flex-col items-center">
          {showSignUp ? <SignUpForm /> : <SignInForm />}

          <p className="mt-6 text-center text-sm text-gray-500">
            {showSignUp ? (
              <>Already have an account?{' '}
                <a href="#" className="font-semibold text-primary hover:text-primary/80" onClick={() => setShowSignUp(false)}>
                  Sign in
                </a>
              </>
            ) : (
              <>Don't have an account?{' '}
                <a href="#" className="font-semibold text-primary hover:text-primary/80" onClick={() => setShowSignUp(true)}>
                  Sign up
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
} 