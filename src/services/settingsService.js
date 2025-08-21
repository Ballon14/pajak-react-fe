export const DEFAULT_ADMIN_SETTINGS = {
    notifications: true,
    desktopNotifications: false,
    chatSound: true,
}

const STORAGE_KEY = "admin_settings"

export function getAdminSettings() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
            const parsed = JSON.parse(raw)
            return { ...DEFAULT_ADMIN_SETTINGS, ...parsed }
        }
        return DEFAULT_ADMIN_SETTINGS
    } catch (error) {
        console.error("Error loading admin settings:", error)
        return DEFAULT_ADMIN_SETTINGS
    }
}

export function saveAdminSettings(settings) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
        return true
    } catch (error) {
        console.error("Error saving admin settings:", error)
        return false
    }
}
