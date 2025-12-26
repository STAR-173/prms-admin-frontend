import axios from 'axios';

// Point to the Next.js API route, which proxies to Backend
const api = axios.create({
    baseURL: '/api', // This triggers the rewrite in next.config.ts
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor (Attach Token)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor (Handle 401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear();
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;