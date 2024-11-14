/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand'
import axios from 'axios'

axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'https://project-tech-ec925.as.r.appspot.com';
axios.defaults.headers.common['Content-Type'] = 'application/json';

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Token found:', token);
        console.log('Request headers:', config.headers);
    } else {
        console.log('No token found in localStorage');
    }
    return config;
}, (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
});

export interface AuthUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin' | 'super-admin';
    status: 'active' | 'inactive';
}

interface SignUpData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface AuthError extends Error {
    code?: string;
    status?: number;
}

interface AuthState {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (data: SignUpData) => Promise<{ message: string }>;
    forgotPassword: (email: string) => Promise<string>;
    resetPassword: (token: string, newPassword: string) => Promise<string>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    initializeAuth: () => Promise<void>;
    getCurrentUser: () => AuthUser | null;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),

    checkAuth: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found during checkAuth');
                set({ user: null, token: null, isAuthenticated: false });
                return;
            }

            console.log('Checking auth with token:', token);
            const response = await axios.get<{ user: AuthUser }>('/api/auth/me');
            console.log('Auth check response:', response.data);
            set({ user: response.data.user, isAuthenticated: true });
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false });
        }
    },

    login: async (email: string, password: string) => {
        try {
            console.log('Attempting login with base URL:', axios.defaults.baseURL);
            const response = await axios.post<{ user: AuthUser; token: string }>('/api/auth/login', { email, password });
            console.log('Login response:', response);

            const { user, token } = response.data;
            const userToStore = {
                ...user,
                firstName: user.firstName,
                lastName: user.lastName
            };
            set({ user, token, isAuthenticated: true });
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userToStore));
        } catch (error) {
            console.error('Login error details:', {
                baseURL: axios.defaults.baseURL,
                error: error,
                response: axios.isAxiosError(error) ? error.response : null
            });
            const authError = new Error('Login failed') as AuthError;
            if (axios.isAxiosError(error)) {
                authError.code = error.code;
                authError.status = error.response?.status;
                authError.message = error.response?.data?.message || 'Login failed';
            }
            throw authError;
        }
    },

    signup: async (data: SignUpData) => {
        try {
            await axios.post<{ message: string }>(
                '/api/auth/signup',
                data
            );
            return { message: 'Sign up successful. Waiting for admin activation.' };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Signup failed');
            }
            throw new Error('Signup failed');
        }
    },

    forgotPassword: async (email: string) => {
        try {
            const response = await axios.post('/api/auth/forgot-password', { email });
            return response.data.message;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Password reset request failed');
            }
            throw new Error('Password reset request failed');
        }
    },

    resetPassword: async (token: string, newPassword: string) => {
        try {
            const response = await axios.post('/api/auth/reset-password', {
                token,
                newPassword
            });
            return response.data.message;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.error || 'Password reset failed');
            }
            throw new Error('Password reset failed');
        }
    },

    logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    initializeAuth: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                set({ user: null, token: null, isAuthenticated: false });
                return;
            }

            const response = await axios.get<{ user: AuthUser }>('/api/auth/me');
            set({
                user: response.data.user,
                token,
                isAuthenticated: true
            });
        } catch (error) {
            sessionStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false });
        }
    },

    getCurrentUser: () => {
        const userStr = sessionStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },
})); 