import api from "../config/api"

export const reportService = {
    // Get summary report
    getSummary: async (dateRange = "this_year") => {
        try {
            const response = await api.get(
                `/reports/summary?dateRange=${dateRange}`
            )
            return response.data
        } catch (error) {
            console.error("Error getting summary report:", error)
            throw error
        }
    },

    // Get property report
    getProperty: async (dateRange = "this_year") => {
        try {
            const response = await api.get(
                `/reports/property?dateRange=${dateRange}`
            )
            return response.data
        } catch (error) {
            console.error("Error getting property report:", error)
            throw error
        }
    },
}
