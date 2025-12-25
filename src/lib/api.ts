import axios from 'axios';

// Create axios instance
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
api.interceptors.request.use((config) => {
    // In a real app, this might come from cookies or a more secure storage.
    // For this implementation, we assume localStorage.
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor: Handle 401 (Logout)
api.interceptors.response.use((response) => response, (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
        // Token expired or invalid
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});

export default api;