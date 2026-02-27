import apiClient, { saveTokens, clearTokens, hasValidTokens } from './apiClient';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupData {
    name: string;
    email: string;
    password: string;
    password_confirmation?: string;
}

export interface User {
    id: number;
    email: string;
    name: string;
    role?: string;
    avatar?: string;
    avatar_url?: string;
    provider?: string;
    uid?: string;
    allow_password_change?: boolean;
    created_at: string;
    updated_at: string;
}

export interface AuthResponse {
    message?: string;
    user: User;
}

export interface ErrorResponse {
    errors?: string[] | { full_messages: string[] };
    error?: string;
}

class AuthService {
    /**
     * Login user
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            // Use custom authenticate route with authentication wrapper
            const response = await apiClient.post<AuthResponse>('/api/authenticate', {
                authentication: credentials
            });

            // Save tokens from headers (this helper will also persist any
            // `Authorization` header value in a cookie so that subsequent
            // requests can send it automatically)
            saveTokens(response.headers);
            localStorage.setItem('isAuthenticated', 'true');

            return response.data;
        } catch (error: any) {
            const errorMessage = this.handleError(error);
            throw new Error(errorMessage);
        }
    }

    /**
     * Sign up new user
     */
    async signup(data: SignupData): Promise<AuthResponse> {
        try {
            // Use custom users route with user wrapper
            const signupData = {
                user: {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    password_confirmation: data.password,
                }
            };

            const response = await apiClient.post<User>('/api/users', signupData);

            // Save tokens from headers (authorization cookie is handled inside saveTokens)
            saveTokens(response.headers);
            localStorage.setItem('isAuthenticated', 'true');

            // Return in AuthResponse format
            return {
                message: 'User created successfully',
                user: response.data
            };
        } catch (error: any) {
            const errorMessage = this.handleError(error);
            throw new Error(errorMessage);
        }
    }

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        try {
            await apiClient.delete('/api/auth/sign_out');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            clearTokens();
        }
    }

    /**
     * Get current user data
     */
    async getCurrentUser(): Promise<AuthResponse> {
        try {
            const response = await apiClient.get<AuthResponse>('/api/auth/validate_token');
            return response.data;
        } catch (error: any) {
            clearTokens();
            throw new Error('Session expired');
        }
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return hasValidTokens();
    }

    /**
     * Request password reset
     */
    async forgotPassword(email: string): Promise<{ message: string }> {
        try {
            const response = await apiClient.post('/api/auth/password', {
                email,
                redirect_url: `${window.location.origin}/reset-password`,
            });
            return response.data;
        } catch (error: any) {
            const errorMessage = this.handleError(error);
            throw new Error(errorMessage);
        }
    }

    /**
     * Handle API errors
     */
    private handleError(error: any): string {
        if (error.response?.data) {
            const data: ErrorResponse = error.response.data;

            // Handle different error formats from DeviseTokenAuth
            if (data.errors) {
                if (Array.isArray(data.errors)) {
                    return data.errors.join(', ');
                }
                if (data.errors.full_messages) {
                    return data.errors.full_messages.join(', ');
                }
            }

            if (data.error) {
                return data.error;
            }
        }

        return error.message || 'An unexpected error occurred';
    }
}

export default new AuthService();
