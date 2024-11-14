/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */
import { create } from 'zustand'


import axios from 'axios'


export interface ContactFormData {
    firstName: string;
    lastName: string;
    contactNumber: string;
    emailAddress: string;
    photo?: any;
    _id?: string;
}

interface Contact {
    _id: string;
    firstName: string;
    lastName: string;
    contactNumber: string;
    emailAddress: string;
    profilePhoto?: string;
    owner: string;
    sharedWith?: ShareInfo[];
}

interface ShareInfo {
    userId: string;
    email: string;
}

interface ContactState {
    contacts: Contact[];
    selectedContact: Contact | null;
    loading: boolean;
    error: string | null;
    getContacts: () => Promise<void>;
    getContact: (id: string) => Promise<void>;
    createContact: (contactData: ContactFormData) => Promise<void>;
    updateContact: (id: string, contactData: Partial<ContactFormData>) => Promise<void>;
    deleteContact: (id: string) => Promise<void>;
    shareContact: (id: string, shareWith: string) => Promise<void>;
    unshareContact: (id: string, unshareWith: string) => Promise<void>;
}

export const useContactStore = create<ContactState>((set, get) => ({
    contacts: [],
    selectedContact: null,
    loading: false,
    error: null,

    getContacts: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get('/api/contacts');
            set({ contacts: response.data, loading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch contacts';
            set({ loading: false, error: errorMessage });
            throw error;
        }
    },

    getContact: async (id: string) => {
        set({ loading: true });
        try {
            const response = await axios.get(`/api/contacts/${id}`);
            set({ selectedContact: response.data, loading: false });
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },

    createContact: async (contactData: ContactFormData) => {
        try {
            const formData = new FormData();
            formData.append('firstName', contactData.firstName);
            formData.append('lastName', contactData.lastName);
            formData.append('contactNumber', contactData.contactNumber);
            formData.append('emailAddress', contactData.emailAddress);
            if (contactData.photo && contactData.photo[0] instanceof File) {
                formData.append('photo', contactData.photo[0]);
            }

            const response = await axios.post('/api/contacts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            set((state) => ({ contacts: [...state.contacts, response.data] }));
        } catch (error) {
            throw error;
        }
    },

    updateContact: async (id: string, contactData: Partial<ContactFormData>) => {
        try {
            const formData = new FormData();
            if (contactData.firstName) formData.append('firstName', contactData.firstName);
            if (contactData.lastName) formData.append('lastName', contactData.lastName);
            if (contactData.contactNumber) formData.append('contactNumber', contactData.contactNumber);
            if (contactData.emailAddress) formData.append('emailAddress', contactData.emailAddress);
            if (contactData.photo && contactData.photo[0] instanceof File) {
                formData.append('photo', contactData.photo[0]);
            }

            const response = await axios.put(`/api/contacts/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            set((state) => ({
                contacts: state.contacts.map(contact =>
                    contact._id === id ? response.data : contact
                ),
                selectedContact: response.data
            }));
        } catch (error) {
            throw error;
        }
    },

    deleteContact: async (id: string) => {
        console.log(id)
        try {
            await axios.delete(`/api/contacts/${id}`);
            set((state) => ({
                contacts: state.contacts.filter(contact => contact._id !== id),
                selectedContact: null
            }));
        } catch (error) {
            throw error;
        }
    },

    shareContact: async (id: string, shareWith: string) => {
        set({ error: null });
        try {
            await axios.post(`/api/contacts/${id}/share`, {
                email: shareWith
            });
            await get().getContacts();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data?.message;
            }
            throw error;
        }
    },

    unshareContact: async (id: string, unshareWith: string) => {
        set({ error: null });
        try {
            await axios.delete(`/api/contacts/${id}/share`, {
                data: { email: unshareWith }
            });
            await get().getContacts();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to unshare contact';
            set({ error: errorMessage });
            throw error;
        }
    },
})); 