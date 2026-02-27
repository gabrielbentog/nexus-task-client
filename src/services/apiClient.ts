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

// Cookie helpers (simple implementation)
const setCookie = (name: string, value: string, days = 7) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
};

const deleteCookie = (name: string) => {
    document.cookie = `${name}=; Max-Age=0; path=/`;
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

// Save tokens to localStorage (and optionally save authorization header in a cookie)
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

    // some API responses may include a Bearer token in Authorization header
    const authorization = headers['authorization'];
    if (authorization) {
        setCookie('authorization', authorization);
    }
};

// Clear all tokens and remove authorization cookie
export const clearTokens = () => {
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.CLIENT);
    localStorage.removeItem(TOKEN_KEYS.UID);
    localStorage.removeItem(TOKEN_KEYS.EXPIRY);
    localStorage.removeItem(TOKEN_KEYS.TOKEN_TYPE);
    localStorage.removeItem('isAuthenticated');
    deleteCookie('authorization');
};

// Check if user has valid tokens or an authorization cookie
export const hasValidTokens = () => {
    const tokens = getStoredTokens();
    const hasTokens = !!(tokens['access-token'] && tokens.client && tokens.uid);
    const hasAuthCookie = !!getCookie('authorization');
    return hasTokens || hasAuthCookie;
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

        // include authorization cookie value if present
        const authCookie = getCookie('authorization');
        if (authCookie) {
            config.headers['Authorization'] = authCookie;
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
        // also tokens may come via Authorization header
        if (headers['authorization']) {
            setCookie('authorization', headers['authorization']);
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
