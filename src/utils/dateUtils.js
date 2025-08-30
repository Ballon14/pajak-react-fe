/**
 * Format date for chat messages
 * @param {string|Date} dateString - The date to format
 * @returns {string} Formatted date string
 */
export const formatChatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()

    // Check if date is today
    const isToday = date.toDateString() === now.toDateString()

    // Check if date is yesterday
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    const isYesterday = date.toDateString() === yesterday.toDateString()

    // Check if date is this week (within 7 days)
    const weekAgo = new Date(now)
    weekAgo.setDate(weekAgo.getDate() - 7)
    const isThisWeek = date > weekAgo

    // Check if date is this year
    const isThisYear = date.getFullYear() === now.getFullYear()

    // Format time
    const timeString = date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
    })

    // Format date based on conditions
    if (isToday) {
        return `Hari ini, ${timeString}`
    } else if (isYesterday) {
        return `Kemarin, ${timeString}`
    } else if (isThisWeek) {
        const dayNames = [
            "Minggu",
            "Senin",
            "Selasa",
            "Rabu",
            "Kamis",
            "Jumat",
            "Sabtu",
        ]
        const dayName = dayNames[date.getDay()]
        return `${dayName}, ${timeString}`
    } else if (isThisYear) {
        return (
            date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
            }) + `, ${timeString}`
        )
    } else {
        return (
            date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            }) + `, ${timeString}`
        )
    }
}

/**
 * Format relative time for recent messages
 * @param {string|Date} dateString - The date to format
 * @returns {string} Formatted relative time
 */
export const formatRelativeTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    const diffHour = Math.floor(diffMs / 3600000)
    const diffDay = Math.floor(diffMs / 86400000)

    if (diffMin < 1) {
        return "baru saja"
    } else if (diffMin < 60) {
        return `${diffMin} menit lalu`
    } else if (diffHour < 24) {
        return `${diffHour} jam lalu`
    } else if (diffDay < 7) {
        return `${diffDay} hari lalu`
    } else {
        return formatChatDate(dateString)
    }
}

/**
 * Check if two dates are on the same day
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date
 * @returns {boolean} True if dates are on the same day
 */
export const isSameDay = (date1, date2) => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    return d1.toDateString() === d2.toDateString()
}

/**
 * Get date separator text for chat messages
 * @param {string|Date} dateString - The date to format
 * @returns {string} Date separator text
 */
export const getDateSeparator = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()

    const isToday = date.toDateString() === now.toDateString()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    const isYesterday = date.toDateString() === yesterday.toDateString()

    if (isToday) {
        return "Hari ini"
    } else if (isYesterday) {
        return "Kemarin"
    } else {
        const isThisYear = date.getFullYear() === now.getFullYear()
        if (isThisYear) {
            return date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
            })
        } else {
            return date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            })
        }
    }
}
