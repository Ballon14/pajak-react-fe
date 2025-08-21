import React, { useState } from "react"
import { authService } from "../../services/authService"
import UserSidebar from "./UserSidebar"

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [user] = useState(authService.getUserFromStorage())

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* User Sidebar Component */}
            <UserSidebar
                user={user}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <div className="lg:pl-64">
                {/* Mobile Header */}
                <div className="lg:hidden bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between px-4 py-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors"
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
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-xs">
                                    {user?.name?.charAt(0)?.toUpperCase() ||
                                        "U"}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    User
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <main className="min-h-screen px-6 py-8 dark:text-gray-100">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default Layout
