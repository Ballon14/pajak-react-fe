import api from "../config/api"

export const authService = {
    async login(credentials) {
        try {
            const response = await api.post("/auth/login", credentials)
            return response.data
        } catch (error) {
            console.error("AuthService login error:", error)
            throw error
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
        try {
            // Validate user data before saving
            if (!user || typeof user !== "object") {
                console.error("Invalid user data provided to setUser:", user)
                return
            }

            if (!user.name || !user.email) {
                console.error("Missing required user fields:", user)
                return
            }

            localStorage.setItem("user", JSON.stringify(user))
        } catch (error) {
            console.error("Error saving user data to localStorage:", error)
        }
    },

    getUserFromStorage() {
        try {
            const user = localStorage.getItem("user")
            if (!user) return null

            const parsedUser = JSON.parse(user)

            // Validate user data structure
            if (!parsedUser || typeof parsedUser !== "object") {
                console.error("Invalid user data in localStorage:", parsedUser)
                this.removeUser()
                return null
            }

            // Check if required fields exist
            if (!parsedUser.name || !parsedUser.email) {
                console.error("Missing required user fields:", parsedUser)
                this.removeUser()
                return null
            }

            return parsedUser
        } catch (error) {
            console.error("Error parsing user data from localStorage:", error)
            this.removeUser()
            return null
        }
    },

    removeUser() {
        localStorage.removeItem("user")
    },

    isAuthenticated() {
        return !!this.getToken()
    },

    isAdmin() {
        const user = this.getUserFromStorage()
        return user?.is_admin === true
    },

    // Debug function to check current user data
    debugUserData() {
        const user = this.getUserFromStorage()
        const token = this.getToken()
        console.log("Current user data:", {
            user,
            token: token ? "exists" : "missing",
            isAuthenticated: this.isAuthenticated(),
            isAdmin: this.isAdmin(),
        })
        return {
            user,
            token,
            isAuthenticated: this.isAuthenticated(),
            isAdmin: this.isAdmin(),
        }
    },
}
