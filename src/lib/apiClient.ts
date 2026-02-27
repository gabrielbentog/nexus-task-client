import Cookies from 'js-cookie';

/**
 * Wrapper around fetch that automatically attaches the `Authorization` cookie value
 * (or other tokens stored as cookies) to the request headers.
 *
 * Usage: import { apiFetch } from '../lib/apiClient';
 * const res = await apiFetch(url, { method: 'GET' });
 */
export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
    const headers = new Headers(init.headers || {});

    // prefer Authorization cookie; fallback to access-token if necessary
    const auth = Cookies.get('Authorization') || Cookies.get('authorization');
    const accessToken = Cookies.get('access-token');
    if (auth && !headers.has('Authorization')) {
        headers.set('Authorization', auth);
    } else if (accessToken && !headers.has('Authorization')) {
        headers.set('Authorization', accessToken);
    }

    // pass through other headers and options
    return fetch(input, { ...init, headers });
}
