import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { Button } from '../components/ui/button';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const resetPassword = useAuthStore(state => state.resetPassword);
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setError('Invalid or missing reset token');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setMessage('');
        setError('');

        try {
            console.log(token, password)
            await resetPassword(token!, password);
            setMessage('Password has been reset successfully');
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
            
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
                        htmlFor="password" 
                        className="block text-sm font-medium text-gray-700"
                    >
                        New Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                        minLength={6}
                    />
                </div>

                <div>
                    <label 
                        htmlFor="confirmPassword" 
                        className="block text-sm font-medium text-gray-700"
                    >
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                        minLength={6}
                    />
                </div>

                <Button
                    type="submit"
                    disabled={isLoading || !token}
                    className="w-full rounded-md bg-black px-3 py-2 text-sm text-white font-semibold shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                </Button>
            </form>
        </div>
    );
};

export default ResetPasswordPage; 