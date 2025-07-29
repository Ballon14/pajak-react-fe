import axios from "axios"
import { authService } from "../services/authService"

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
})

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = authService.getToken()
        console.log("🔒 API Request:", {
            url: config.url,
            method: config.method,
            hasToken: !!token,
        })
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
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
        console.log("✅ API Response:", {
            url: response.config.url,
            status: response.status,
            data: response.data,
        })
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
                console.log("🚫 Unauthorized - Logging out")
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
