import { io } from "socket.io-client"
import { authService } from "./authService"

let socket = null

// Get socket URL from environment or fallback
const getSocketURL = () => {
    // Use environment variable if available
    if (import.meta.env.VITE_SOCKET_URL) {
        return import.meta.env.VITE_SOCKET_URL
    }

    // Check if we're in production
    if (import.meta.env.PROD) {
        // In production, use the same domain as the frontend
        return window.location.origin
    }

    // In development, use localhost
    return "http://localhost:8000"
}

export function getChatSocket() {
    if (!socket) {
        const token = authService.getToken()
        socket = io(getSocketURL(), {
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            auth: { token },
        })
    }
    return socket
}

export function disconnectChatSocket() {
    if (socket) {
        socket.disconnect()
        socket = null
    }
}
