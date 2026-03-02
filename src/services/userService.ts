import apiClient from './apiClient';
import { User } from '../types';

export interface UserFilters {
    email?: string;
    name?: string;
    q?: string; // generic search query
}

export const userService = {
    // Get all users with optional filters
    async getUsers(filters?: UserFilters): Promise<User[]> {
        const params = new URLSearchParams();

        if (filters?.email) {
            params.append('email', filters.email);
        }
        if (filters?.name) {
            params.append('name', filters.name);
        }
        if (filters?.q) {
            params.append('q', filters.q);
        }

        const queryString = params.toString();
        const url = queryString ? `/api/users?${queryString}` : '/api/users';

        const response = await apiClient.get(url);
        return response.data.data || response.data;
    },

    // Get a single user by ID
    async getUser(id: string | number): Promise<User> {
        const response = await apiClient.get(`/api/users/${id}`);
        return response.data.data || response.data;
    },

    // Search users by email (convenience method)
    async searchByEmail(email: string): Promise<User[]> {
        return this.getUsers({ email });
    },
};

export default userService;
