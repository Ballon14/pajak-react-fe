/**
 * Notification utilities for chat messages
 */

// Request browser notification permission
export const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
        console.log("Browser tidak mendukung notifikasi")
        return false
    }

    if (Notification.permission === "granted") {
        return true
    }

    if (Notification.permission === "denied") {
        console.log("Izin notifikasi ditolak")
        return false
    }

    const permission = await Notification.requestPermission()
    return permission === "granted"
}

// Show browser notification
export const showBrowserNotification = (title, options = {}) => {
    if (!("Notification" in window) || Notification.permission !== "granted") {
        return
    }

    const defaultOptions = {
        icon: "/icon.svg",
        badge: "/icon.svg",
        requireInteraction: false,
        silent: false,
        ...options,
    }

    try {
        new Notification(title, defaultOptions)
    } catch (error) {
        console.error("Error showing notification:", error)
    }
}

// Play notification sound
export const playNotificationSound = () => {
    try {
        // Create audio context for notification sound
        const audioContext = new (window.AudioContext ||
            window.webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2)

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.3
        )

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
    } catch (error) {
        console.error("Error playing notification sound:", error)
    }
}

// Check if user is currently on the page
export const isPageVisible = () => {
    return !document.hidden
}

// Check if chat is currently focused/active
export const isChatActive = () => {
    // Check if chat container is visible and focused
    const chatContainer = document.querySelector(".chat-container")
    if (!chatContainer) return false

    // Check if chat is open and visible
    const isVisible = chatContainer.offsetParent !== null
    const isFocused =
        document.activeElement?.closest(".chat-container") !== null

    return isVisible && isFocused
}

// Show notification for new message
export const showNewMessageNotification = (
    senderName,
    messageContent,
    isFromAdmin = false
) => {
    const title = isFromAdmin ? "Pesan dari Admin" : "Pesan Baru"
    const body = `${senderName}: ${messageContent.substring(0, 50)}${
        messageContent.length > 50 ? "..." : ""
    }`

    // Show browser notification if page is not visible
    if (!isPageVisible()) {
        showBrowserNotification(title, {
            body,
            tag: "new-message",
            requireInteraction: false,
            silent: false,
        })

        // Update page title to show notification
        updatePageTitle(true)
    }

    // Play sound and update title if page is visible but chat is not active
    if (isPageVisible() && !isChatActive()) {
        playNotificationSound()
        updatePageTitle(true)
    }
}

// Update page title to show notification
export const updatePageTitle = (hasNotification = false) => {
    const originalTitle = document.title.replace(/^\[📬\]\s*/, "")

    if (hasNotification) {
        document.title = `[📬] ${originalTitle}`
    } else {
        document.title = originalTitle
    }
}

// Reset page title when user focuses on the page
export const resetPageTitle = () => {
    updatePageTitle(false)
}

// Initialize notification system
export const initializeNotifications = async () => {
    const hasPermission = await requestNotificationPermission()
    return hasPermission
}
