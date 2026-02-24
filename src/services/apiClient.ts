import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance
export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Token storage keys
const TOKEN_KEYS = {
    ACCESS_TOKEN: 'access-token',
    CLIENT: 'client',
    UID: 'uid',
    EXPIRY: 'expiry',
    TOKEN_TYPE: 'token-type',
};

// Get stored tokens
export const getStoredTokens = () => {
    return {
        'access-token': localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN),
        client: localStorage.getItem(TOKEN_KEYS.CLIENT),
        uid: localStorage.getItem(TOKEN_KEYS.UID),
        expiry: localStorage.getItem(TOKEN_KEYS.EXPIRY),
        'token-type': localStorage.getItem(TOKEN_KEYS.TOKEN_TYPE),
    };
};

// Save tokens to localStorage
export const saveTokens = (headers: any) => {
    const accessToken = headers['access-token'];
    const client = headers['client'];
    const uid = headers['uid'];
    const expiry = headers['expiry'];
    const tokenType = headers['token-type'];

    if (accessToken) localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
    if (client) localStorage.setItem(TOKEN_KEYS.CLIENT, client);
    if (uid) localStorage.setItem(TOKEN_KEYS.UID, uid);
    if (expiry) localStorage.setItem(TOKEN_KEYS.EXPIRY, expiry);
    if (tokenType) localStorage.setItem(TOKEN_KEYS.TOKEN_TYPE, tokenType);
};

// Clear all tokens
export const clearTokens = () => {
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.CLIENT);
    localStorage.removeItem(TOKEN_KEYS.UID);
    localStorage.removeItem(TOKEN_KEYS.EXPIRY);
    localStorage.removeItem(TOKEN_KEYS.TOKEN_TYPE);
    localStorage.removeItem('isAuthenticated');
};

// Check if user has valid tokens
export const hasValidTokens = () => {
    const tokens = getStoredTokens();
    return !!(tokens['access-token'] && tokens.client && tokens.uid);
};

// Request interceptor - Add auth tokens to every request
apiClient.interceptors.request.use(
    (config) => {
        const tokens = getStoredTokens();

        if (tokens['access-token']) {
            config.headers['access-token'] = tokens['access-token'];
            config.headers['client'] = tokens.client;
            config.headers['uid'] = tokens.uid;
            config.headers['token-type'] = tokens['token-type'] || 'Bearer';
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Save new tokens from every response
apiClient.interceptors.response.use(
    (response) => {
        // DeviseTokenAuth sends new tokens in every response
        const headers = response.headers;
        if (headers['access-token']) {
            saveTokens(headers);
        }

        return response;
    },
    (error) => {
        // If 401, clear tokens and redirect to login
        if (error.response?.status === 401) {
            clearTokens();
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default apiClient;
