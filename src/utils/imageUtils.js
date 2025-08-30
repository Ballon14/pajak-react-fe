// Get base URL for images
const getImageBaseURL = () => {
    // Use environment variable if available
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL.replace("/api", "")
    }

    // Check if we're in production (Vite sets this automatically)
    if (import.meta.env.PROD) {
        // In production, use the same domain as the frontend
        return window.location.origin
    }

    // In development, use the Vite proxy to avoid CORS issues
    return window.location.origin
}

// Convert relative image path to full URL
export const getImageURL = (imagePath) => {
    if (!imagePath) return null

    // If it's already a full URL, return as is
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
        return imagePath
    }

    // If it's a relative path, prepend the base URL
    const baseURL = getImageBaseURL()
    return `${baseURL}${imagePath}`
}

// Check if image URL is valid
export const isValidImageURL = (url) => {
    if (!url) return false
    return (
        url.startsWith("http://") ||
        url.startsWith("https://") ||
        url.startsWith("/uploads/")
    )
}
