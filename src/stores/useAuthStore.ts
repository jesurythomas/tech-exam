/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000';

axios.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Token found:', token);
        console.log('Request headers:', config.headers);
    } else {
        console.log('No token found in sessionStorage');
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
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (token: string, newPassword: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    initializeAuth: () => Promise<void>;
    getCurrentUser: () => AuthUser | null;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: sessionStorage.getItem('token'),
    isAuthenticated: !!sessionStorage.getItem('token'),

    checkAuth: async () => {
        try {
            const token = sessionStorage.getItem('token');
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
            sessionStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false });
        }
    },

    login: async (email: string, password: string) => {
        try {
            const response = await axios.post<{ user: AuthUser; token: string }>('/api/auth/login', { email, password });
            const { user, token } = response.data;
            const userToStore = {
                ...user,
                firstName: user.firstName,
                lastName: user.lastName
            };
            set({ user, token, isAuthenticated: true });
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('user', JSON.stringify(userToStore));
        } catch (error) {
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
            await axios.post('/api/auth/forgot-password', { email });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Password reset request failed');
            }
            throw new Error('Password reset request failed');
        }
    },

    resetPassword: async (token: string, newPassword: string) => {
        try {
            await axios.post('/api/auth/reset-password', { token, newPassword });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Password reset failed');
            }
            throw new Error('Password reset failed');
        }
    },

    logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
    },

    initializeAuth: async () => {
        try {
            const token = sessionStorage.getItem('token');
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