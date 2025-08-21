import React, { useEffect, useState } from "react"
import { AdminLayout, Toast, ConfirmModal } from "../../components/ui"

const STORAGE_KEY = "admin_settings"

const defaultSettings = {
    notifications: true,
    desktopNotifications: false,
    chatSound: true,
}

const AdminSettings = () => {
    const [settings, setSettings] = useState(defaultSettings)
    const [toast, setToast] = useState(null)
    const [confirmOpen, setConfirmOpen] = useState(false)

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (raw) {
                const parsed = JSON.parse(raw)
                setSettings({ ...defaultSettings, ...parsed })
            }
        } catch (error) {
            console.error("Error loading settings:", error)
        }
    }, [])

    const showToast = (message, type = "info") => setToast({ message, type })

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target
        setSettings((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    const handleSave = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))

        if (
            settings.desktopNotifications &&
            typeof window !== "undefined" &&
            "Notification" in window
        ) {
            try {
                if (Notification.permission === "default") {
                    Notification.requestPermission().then((perm) => {
                        if (perm === "granted") {
                            showToast(
                                "Izin notifikasi desktop diberikan",
                                "success"
                            )
                        } else if (perm === "denied") {
                            showToast(
                                "Izin notifikasi desktop ditolak",
                                "warning"
                            )
                        }
                    })
                } else if (Notification.permission === "denied") {
                    showToast(
                        "Izin notifikasi desktop sebelumnya ditolak",
                        "warning"
                    )
                } else if (Notification.permission === "granted") {
                    showToast("Pengaturan berhasil disimpan", "success")
                    return
                }
            } catch (e) {
                console.error(e)
            }
        }
        showToast("Pengaturan berhasil disimpan", "success")
    }

    const askReset = () => setConfirmOpen(true)

    const confirmReset = () => {
        setSettings(defaultSettings)
        localStorage.removeItem(STORAGE_KEY)
        setConfirmOpen(false)
        showToast("Pengaturan berhasil direset", "success")
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Pengaturan Admin
                    </h1>
                    <p className="text-gray-600">
                        Kelola pengaturan aplikasi sesuai preferensi Anda
                    </p>
                </div>

                {/* Settings Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Notifikasi */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">
                            Pengaturan Notifikasi
                        </h2>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Notifikasi dalam aplikasi
                                    </label>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Tampilkan notifikasi di dalam aplikasi
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="notifications"
                                        checked={settings.notifications}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Notifikasi desktop
                                    </label>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Tampilkan notifikasi di desktop
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="desktopNotifications"
                                        checked={settings.desktopNotifications}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Suara chat
                                    </label>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Putar suara saat ada pesan chat baru
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="chatSound"
                                        checked={settings.chatSound}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* System Information */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">
                            Informasi Sistem
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-sm font-medium text-gray-700">
                                    Versi Aplikasi
                                </span>
                                <span className="text-sm text-gray-900 font-mono">
                                    v1.0.0
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-sm font-medium text-gray-700">
                                    Database Status
                                </span>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                    Connected
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <span className="text-sm font-medium text-gray-700">
                                    Last Backup
                                </span>
                                <span className="text-sm text-gray-900">
                                    2 hours ago
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleSave}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        Simpan Pengaturan
                    </button>
                    <button
                        onClick={askReset}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        Reset ke Default
                    </button>
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={confirmReset}
                title="Reset Pengaturan"
                message="Apakah Anda yakin ingin mereset semua pengaturan ke nilai default? Tindakan ini tidak dapat dibatalkan."
                confirmText="Reset"
                cancelText="Batal"
            />
        </AdminLayout>
    )
}

export default AdminSettings
