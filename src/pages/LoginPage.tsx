import { SignInForm } from '@/components/auth/SignInForm'
import { useState } from 'react';
import { SignUpForm } from '@/components/auth/SignUpForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export function LoginPage() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="flex flex-col items-center">
          {showForgotPassword ? (
            <>
              <ForgotPasswordForm />
              <p className="mt-2 text-sm text-gray-500">
                <a
                  href="#"
                  className="font-semibold text-primary hover:text-primary/80"
                  onClick={() => setShowForgotPassword(false)}
                >
                  Back to Sign In
                </a>
              </p>
            </>
          ) : showSignUp ? (
            <SignUpForm />
          ) : (
            <SignInForm />
          )}

          {!showSignUp && !showForgotPassword && (
            <p className="mt-2 text-sm text-gray-500">
              <a
                href="#"
                className="font-semibold text-primary hover:text-primary/80"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot your password?
              </a>
            </p>
          )}

          {!showForgotPassword && (
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
          )}
        </div>
      </div>
    </div>
  )
} 