import React, { useEffect, useState } from "react"
import { AdminLayout, Toast, ConfirmModal } from "../../components/ui"

const STORAGE_KEY = "admin_settings"

const defaultSettings = {
    theme: "light",
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
        // Apply theme immediately
        try {
            const root = document.documentElement
            if (settings.theme === "dark") root.classList.add("dark")
            else root.classList.remove("dark")
        } catch (e) {
            console.error(e)
        }
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings))
        setConfirmOpen(false)
        showToast("Pengaturan dikembalikan ke default", "success")
    }

    return (
        <AdminLayout>
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Pengaturan Admin
                        </h1>
                        <p className="text-gray-600">
                            Sesuaikan preferensi panel admin Anda
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={askReset}
                            className="px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                        >
                            Reset Default
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Simpan
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Tampilan */}
                    <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Tampilan
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tema
                                </label>
                                <select
                                    name="theme"
                                    value={settings.theme}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="light">Terang</option>
                                    <option value="dark">Gelap</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Notifikasi */}
                    <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Notifikasi
                        </h2>
                        <div className="space-y-4">
                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="notifications"
                                    checked={settings.notifications}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                />
                                <span>Aktifkan notifikasi di panel</span>
                            </label>
                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="desktopNotifications"
                                    checked={settings.desktopNotifications}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                />
                                <span>
                                    Aktifkan notifikasi desktop (browser)
                                </span>
                            </label>
                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="chatSound"
                                    checked={settings.chatSound}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                />
                                <span>Bunyikan suara saat pesan chat baru</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {confirmOpen && (
                <ConfirmModal
                    isOpen={confirmOpen}
                    title="Reset Pengaturan"
                    message={"Kembalikan semua pengaturan ke default?"}
                    confirmText="Reset"
                    cancelText="Batal"
                    onConfirm={confirmReset}
                    onCancel={() => setConfirmOpen(false)}
                />
            )}
        </AdminLayout>
    )
}

export default AdminSettings
