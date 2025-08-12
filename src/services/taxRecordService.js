import api from "../config/api"

export const taxRecordService = {
    // Get all tax records
    getAll: async () => {
        try {
            const response = await api.get("/tax-records")
            return response.data
        } catch (error) {
            console.error("Error getting tax records:", error)
            throw error
        }
    },

    // Get all tax records for admin (all users)
    getTaxRecords: async () => {
        try {
            const response = await api.get("/admin/tax-records")
            return response.data
        } catch (error) {
            console.error("Error getting admin tax records:", error)
            throw error
        }
    },

    // Get statistics
    getStatistics: async () => {
        try {
            const response = await api.get("/tax-records/statistics")
            return response.data
        } catch (error) {
            console.error("Error getting statistics:", error)
            throw error
        }
    },

    // Get admin statistics (all users)
    getAdminStatistics: async () => {
        try {
            const response = await api.get("/admin/statistics")
            return response.data
        } catch (error) {
            console.error("Error getting admin statistics:", error)
            throw error
        }
    },

    // Get single tax record
    getById: async (id) => {
        try {
            const response = await api.get(`/tax-records/${id}`)
            return response.data
        } catch (error) {
            console.error("Error getting tax record:", error)
            throw error
        }
    },

    // Get single tax record for admin (no user restrictions)
    getByIdAdmin: async (id) => {
        try {
            const response = await api.get(`/admin/tax-records/${id}`)
            return response.data
        } catch (error) {
            console.error("Error getting admin tax record:", error)
            throw error
        }
    },

    // Create new tax record
    create: async (data) => {
        try {
            const response = await api.post("/tax-records", data)
            return response.data
        } catch (error) {
            console.error("Error creating tax record:", error)
            throw error
        }
    },

    // Update tax record
    update: async (id, data) => {
        try {
            const response = await api.put(`/tax-records/${id}`, data)
            return response.data
        } catch (error) {
            console.error("Error updating tax record:", error)
            throw error
        }
    },

    // Update tax record for admin (no user restrictions)
    updateAdmin: async (id, data) => {
        try {
            const response = await api.put(`/admin/tax-records/${id}`, data)
            return response.data
        } catch (error) {
            console.error("Error updating admin tax record:", error)
            throw error
        }
    },

    // Delete tax record
    delete: async (id) => {
        try {
            const response = await api.delete(`/tax-records/${id}`)
            return response.data
        } catch (error) {
            console.error("Error deleting tax record:", error)
            throw error
        }
    },

    // Check and auto-create tax records for new year
    checkAndCreateForNewYear: async () => {
        const response = await api.get("/tax-records/check-year")
        return response.data
    },

    // Manually create tax records for specific year
    createForYear: async (year) => {
        const response = await api.post("/tax-records/auto-create", { year })
        return response.data
    },

    // Get outstanding tax records (tunggakan)
    getOutstanding: async () => {
        const response = await api.get("/tax-records/outstanding")
        return response.data
    },

    // Get tax records by year
    getByYear: async (year) => {
        const response = await api.get(`/tax-records/year/${year}`)
        return response.data
    },
}
