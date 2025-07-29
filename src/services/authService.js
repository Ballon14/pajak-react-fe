import api from "../config/api"

export const authService = {
    async login(credentials) {
        try {
            const response = await api.post("/auth/login", credentials)
            return response.data
        } catch (error) {
            console.error('AuthService login error:', error);
            throw error;
        }
    },

    async register(userData) {
        try {
            const response = await api.post("/auth/register", userData)
            return response.data
        } catch (error) {
            console.error("AuthService register error:", error)
            throw error
        }
    },

    async logout() {
        const response = await api.post("/auth/logout")
        return response.data
    },

    async getUser() {
        const response = await api.get("/auth/user")
        return response.data
    },

    setToken(token) {
        localStorage.setItem("token", token)
    },

    getToken() {
        return localStorage.getItem("token")
    },

    removeToken() {
        localStorage.removeItem("token")
    },

    setUser(user) {
        localStorage.setItem("user", JSON.stringify(user))
    },

    getUserFromStorage() {
        const user = localStorage.getItem("user")
        return user ? JSON.parse(user) : null
    },

    removeUser() {
        localStorage.removeItem("user")
    },

    isAuthenticated() {
        return !!this.getToken()
    },

    isAdmin() {
        const user = this.getUserFromStorage()
        return user?.is_admin || false
    },
}
