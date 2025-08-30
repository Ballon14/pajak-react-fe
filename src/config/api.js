import axios from "axios"
import { authService } from "../services/authService"

// Get base URL from environment variable or fallback to localhost for development
const getBaseURL = () => {
    // Use environment variable if available
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL
    }

    // Check if we're in production (Vite sets this automatically)
    if (import.meta.env.PROD) {
        // In production, use the same domain as the frontend
        const prodURL = `${window.location.origin}/api`
        return prodURL
    }

    // In development, use localhost
    const devURL = "http://localhost:8000/api"
    return devURL
}

const baseURL = getBaseURL()

const api = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    timeout: 10000, // 10 second timeout
})

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = authService.getToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        // Don't set Content-Type for FormData requests
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"]
        }

        return config
    },
    (error) => {
        console.error("❌ API Request Error:", error)
        return Promise.reject(error)
    }
)

// Add a response interceptor
api.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        console.error("❌ API Response Error:", {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
        })

        if (error.response) {
            if (error.response.status === 401) {
                authService.removeToken()
                authService.removeUser()
                window.location.href = "/login"
            }
            if (error.response.data && error.response.data.message) {
                return Promise.reject(new Error(error.response.data.message))
            }
        }
        return Promise.reject(error)
    }
)

export default api
