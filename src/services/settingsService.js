export const DEFAULT_ADMIN_SETTINGS = {
    theme: "light",
    notifications: true,
    desktopNotifications: false,
    chatSound: true,
}

const STORAGE_KEY = "admin_settings"

export function getAdminSettings() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return { ...DEFAULT_ADMIN_SETTINGS }
        const parsed = JSON.parse(raw)
        return { ...DEFAULT_ADMIN_SETTINGS, ...parsed }
    } catch (error) {
        console.error("Error loading settings:", error)
        return { ...DEFAULT_ADMIN_SETTINGS }
    }
}
