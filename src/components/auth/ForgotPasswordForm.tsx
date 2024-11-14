import { useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { Button } from '../ui/button';

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const forgotPassword = useAuthStore(state => state.forgotPassword);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        try {
            await forgotPassword(email);
            setMessage('Password reset instructions have been sent to your email.');
            setEmail(''); // Clear the form
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
            
            {message && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                    {message}
                </div>
            )}
            
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label 
                        htmlFor="email" 
                        className="block text-sm font-medium text-gray-700"
                    >
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                        placeholder="Enter your email"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-md bg-black px-3 py-2 text-sm text-white font-semibold shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Sending...' : 'Reset Password'}
                </Button>
            </form>
        </div>
    );
};

export default ForgotPasswordForm; 