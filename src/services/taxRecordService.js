import api from "../config/api"

export const taxRecordService = {
    // Get all tax records
    async getAll() {
        try {
            const response = await api.get("/tax-records")
            return response.data
        } catch (error) {
            console.error("TaxRecordService getAll error:", error)
            throw error
        }
    },

    // Get single tax record
    async getById(id) {
        try {
            const response = await api.get(`/tax-records/${id}`)
            return response.data
        } catch (error) {
            console.error("TaxRecordService getById error:", error)
            throw error
        }
    },

    // Create new tax record
    async create(data) {
        try {
            const response = await api.post("/tax-records", data)
            return response.data
        } catch (error) {
            console.error("TaxRecordService create error:", error)
            throw error
        }
    },

    // Update tax record
    async update(id, data) {
        try {
            const response = await api.put(`/tax-records/${id}`, data)
            return response.data
        } catch (error) {
            console.error("TaxRecordService update error:", error)
            throw error
        }
    },

    // Delete tax record
    async delete(id) {
        try {
            const response = await api.delete(`/tax-records/${id}`)
            return response.data
        } catch (error) {
            console.error("TaxRecordService delete error:", error)
            throw error
        }
    },

    // Get statistics
    async getStatistics() {
        try {
            console.log("🌐 Making API request to /tax-records/statistics")
            const token = localStorage.getItem("token")
            console.log("🔑 Token exists:", !!token)

            const response = await api.get("/tax-records/statistics")
            console.log("📡 Raw API response:", {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                data: response.data,
            })
            return response.data
        } catch (error) {
            console.error("❌ Statistics API Error:", {
                name: error.name,
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                responseData: error.response?.data,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    headers: error.config?.headers,
                },
            })
            throw error
        }
    },
}
