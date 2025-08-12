import React, { useState } from "react"
import AdminSidebar from "./AdminSidebar"

const AdminLayout = ({ children, user }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Admin Sidebar Component */}
            <AdminSidebar
                user={user}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col pl-0 lg:pl-64">
                {/* Mobile Header */}
                <div className="lg:hidden bg-white shadow-sm border-b border-gray-200">
                    <div className="flex items-center justify-between px-4 py-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
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
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-xs">
                                    {user?.name?.charAt(0)?.toUpperCase() ||
                                        "A"}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Administrator
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <main className="flex-1 min-h-screen">{children}</main>
            </div>
        </div>
    )
}

export default AdminLayout
