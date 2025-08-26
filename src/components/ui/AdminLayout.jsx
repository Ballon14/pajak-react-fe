import React, { useState, useEffect } from "react"
import { authService } from "../../services/authService"
import AdminSidebar from "./AdminSidebar"

const AdminLayout = ({ children, user: propUser }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [user, setUser] = useState(propUser)

    useEffect(() => {
        // If no user prop provided, get from storage
        if (!user) {
            const userData = authService.getUserFromStorage()
            setUser(userData)
        }

        // Debug: Check user data
        if (process.env.NODE_ENV === "development") {
            authService.debugUserData()
        }
    }, [user, propUser])

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Admin Sidebar Component */}
            <AdminSidebar
                user={user}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:ml-64">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
                    <div className="flex items-center justify-between px-4 lg:px-6 py-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">
                                    Panel Admin
                                </h1>
                                <p className="text-sm text-gray-500 hidden sm:block">
                                    Sistem Manajemen Pajak
                                </p>
                            </div>
                        </div>

                        {/* User Profile */}
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-900">
                                    {user?.name || "Admin"}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {user?.email || "admin@example.com"}
                                </p>
                            </div>
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-white">
                                    {user?.name?.charAt(0)?.toUpperCase() ||
                                        "A"}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto">
                    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
