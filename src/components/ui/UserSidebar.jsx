import React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { authService } from "../../services/authService"

const UserSidebar = ({ user, isOpen, onClose }) => {
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = async () => {
        try {
            await authService.logout()
            navigate("/login")
        } catch (error) {
            console.error("Logout error:", error)
        }
    }

    const handleMenuClick = (href) => {
        navigate(href)
        if (window.innerWidth < 1024) {
            onClose()
        }
    }

    const menuItems = [
        {
            href: "/dashboard",
            label: "Dashboard",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
                    />
                </svg>
            ),
        },
        {
            href: "/tax-records",
            label: "Data Pajak",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
            ),
        },
        {
            href: "/tax-records/create",
            label: "Tambah Pajak",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
            ),
        },
        {
            href: "/reports",
            label: "Laporan",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                </svg>
            ),
        },
    ]

    const sidebarContent = (
        <>
            {/* Sidebar Header */}
            <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-700 dark:to-green-700">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">
                            PajakApp
                        </h1>
                        <p className="text-xs text-blue-100 dark:text-blue-200">
                            User Panel
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="lg:hidden p-1 text-white/80 hover:text-white rounded-lg transition-colors"
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
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.href
                    return (
                        <button
                            key={item.href}
                            onClick={() => handleMenuClick(item.href)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                isActive
                                    ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                            }`}
                        >
                            <div
                                className={`w-5 h-5 ${
                                    isActive
                                        ? "text-blue-600 dark:text-blue-400"
                                        : "text-gray-400 dark:text-gray-500"
                                }`}
                            >
                                {item.icon}
                            </div>
                            <span>{item.label}</span>
                            {isActive && (
                                <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full ml-auto"></div>
                            )}
                        </button>
                    )
                })}
            </nav>

            {/* User Profile Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            User
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Logout"
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
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </>
    )

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                    onClick={onClose}
                ></div>
            )}

            {/* Sidebar Mobile */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {sidebarContent}
            </div>

            {/* Sidebar Desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:w-64 lg:bg-white dark:lg:bg-gray-900 lg:shadow-xl lg:block">
                {sidebarContent}
            </div>
        </>
    )
}

export default UserSidebar
