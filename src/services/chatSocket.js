import { io } from "socket.io-client"
import { authService } from "./authService"

let socket = null

export function getChatSocket() {
    if (!socket) {
        const token = authService.getToken()
        socket = io("http://localhost:8000", {
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
