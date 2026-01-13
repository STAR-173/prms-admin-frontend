/* path: prms-admin-frontend/src/lib/api.ts */
import axios from "axios";

// Create Axios instance
const api = axios.create({
    // Use relative path so Next.js Middleware can proxy it
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor (Auth Token)
api.interceptors.request.use(
    (config) => {
        // Only access localStorage on client-side
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("accessToken");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor (Error Handling)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 (Unauthorized) -> Redirect to Login
        if (error.response?.status === 401 && typeof window !== "undefined") {
            // Prevent infinite loop if already on login
            if (!window.location.pathname.startsWith('/login')) {
                localStorage.clear();
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;