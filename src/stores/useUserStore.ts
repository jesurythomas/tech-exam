/* eslint-disable no-useless-catch */
import { create } from 'zustand'
import axios from 'axios'
import { User } from '../types/index'


interface UserState {
    users: User[]
    loading: boolean
    error: string | null
    getUsers: () => Promise<void>
    updateUser: (id: string, userData: Partial<User>) => Promise<void>
    deleteUser: (id: string) => Promise<void>
    activateUser: (id: string) => Promise<void>
    deactivateUser: (id: string) => Promise<void>
    getUser: (id: string) => Promise<void>
    getUserByEmail: (email: string) => Promise<void>
}

export const useUserStore = create<UserState>((set) => ({
    users: [],
    loading: false,
    error: null,

    getUsers: async () => {
        set({ loading: true, error: null })
        try {
            const response = await axios.get('/api/users')
            set({ users: response.data, loading: false })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users'
            set({ loading: false, error: errorMessage })
            throw error
        }
    },

    updateUser: async (id: string, userData: Partial<User>) => {
        try {
            const response = await axios.put(`/api/users/${id}`, userData)
            set((state) => ({
                users: state.users.map(user =>
                    user._id === id ? response.data : user
                )
            }))
        } catch (error) {
            throw error
        }
    },

    deleteUser: async (id: string) => {
        try {
            await axios.delete(`/api/users/${id}`)
            set((state) => ({
                users: state.users.filter(user => user._id !== id)
            }))
        } catch (error) {
            throw error
        }
    },

    activateUser: async (id: string) => {
        try {
            await axios.put(`/api/users/${id}`, { status: 'active' })
            set((state) => ({
                users: state.users.map(user =>
                    user._id === id ? { ...user, status: 'active' } : user
                )
            }))
        } catch (error) {
            throw error
        }
    },

    deactivateUser: async (id: string) => {
        try {
            await axios.put(`/api/users/${id}`, { status: 'inactive' })
            set((state) => ({
                users: state.users.map(user =>
                    user._id === id ? { ...user, status: 'inactive' } : user
                )
            }))
        } catch (error) {
            throw error
        }
    },

    getUser: async (id: string) => {
        set({ loading: true, error: null })
        try {
            const response = await axios.get(`/api/users/${id}`)
            set((state) => ({
                users: state.users.map(user =>
                    user._id === id ? response.data : user
                ),
                loading: false
            }))
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user'
            set({ loading: false, error: errorMessage })
            throw error
        }
    },

    getUserByEmail: async (email: string) => {
        set({ loading: true, error: null })
        try {
            const response = await axios.get(`/api/users/email/${email}`)
            set((state) => ({
                users: [...state.users, response.data].filter((user, index, self) =>
                    index === self.findIndex((u) => u._id === user._id)
                ),
                loading: false
            }))
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user by email'
            set({ loading: false, error: errorMessage })
            throw error
        }
    },
})) 