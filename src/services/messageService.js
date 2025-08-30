import api from "../config/api"

export const messageService = {
    // Send a message
    sendMessage: async (to_user_id, content) => {
        try {
            const response = await api.post("/messages/send", {
                to_user_id,
                content,
            })
            return response.data
        } catch (error) {
            console.error("messageService.sendMessage error:", error)
            throw error
        }
    },

    // Get conversation history
    getConversationHistory: async (with_user_id, limit = 50, page = 1) => {
        const response = await api.get(
            `/messages/conversation/${with_user_id}`,
            {
                params: { limit, page },
            }
        )
        return response.data
    },

    // Get conversations list (for admin)
    getConversations: async (limit = 20, page = 1) => {
        const response = await api.get("/messages/conversations", {
            params: { limit, page },
        })
        return response.data
    },

    // Mark conversation as seen
    markConversationAsSeen: async (with_user_id) => {
        const response = await api.post(
            `/messages/conversation/${with_user_id}/seen`
        )
        return response.data
    },

    // Delete conversation (admin only)
    deleteConversation: async (with_user_id) => {
        const response = await api.delete(
            `/messages/conversation/${with_user_id}`
        )
        return response.data
    },
}
