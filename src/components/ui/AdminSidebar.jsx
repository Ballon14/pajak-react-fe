import React, { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { authService } from "../../services/authService"
import { getChatSocket } from "../../services/chatSocket"

const AdminSidebar = ({ user, isOpen, onClose }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        const socket = getChatSocket()

        const handleNewMessage = (msg) => {
            // Only count messages from users (not from admin)
            if (msg.sender_id !== user?.id && msg.sender_id !== user?._id) {
                setUnreadCount((prev) => prev + 1)
            }
        }

        socket.on("message:new", handleNewMessage)

        return () => {
            socket.off("message:new", handleNewMessage)
        }
    }, [user])

    const handleLogout = async () => {
        try {
            await authService.logout()
            navigate("/login")
        } catch (error) {
            console.error("Logout error:", error)
        }
    }

    const handleMenuClick = (href) => {
        // Reset unread count when entering chat
        if (href === "/admin/chat") {
            setUnreadCount(0)
        }
        navigate(href)
        if (window.innerWidth < 1024) {
            onClose()
        }
    }

    const menuItems = [
        {
            href: "/admin/dashboard",
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
            href: "/admin/users",
            label: "Users",
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
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                </svg>
            ),
        },
        {
            href: "/admin/tax-records",
            label: "Tax Records",
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
            href: "/admin/reports",
            label: "Reports",
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
        {
            href: "/admin/settings",
            label: "Settings",
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
                        d="M11.983 13.9a1.9 1.9 0 110-3.8 1.9 1.9 0 010 3.8zM19.4 15a7.963 7.963 0 00.1-1 7.963 7.963 0 00-.1-1l2.1-1.6a.5.5 0 00.1-.6l-2-3.5a.5.5 0 00-.6-.2l-2.5 1a7.28 7.28 0 00-1.7-1l-.4-2.7a.5.5 0 00-.5-.4h-4a.5.5 0 00-.5.4l-.4 2.7a7.28 7.28 0 00-1.7 1l-2.5-1a.5.5 0 00-.6.2l-2 3.5a.5.5 0 00.1.6L4.6 13a7.963 7.963 0 00-.1 1 7.963 7.963 0 00.1 1l-2.1 1.6a.5.5 0 00-.1.6l2 3.5a.5.5 0 00.6.2l2.5-1a7.28 7.28 0 001.7 1l.4 2.7a.5.5 0 00.5.4h4a.5.5 0 00.5-.4l.4-2.7a7.28 7.28 0 001.7-1l2.5 1a.5.5 0 00.6-.2l2-3.5a.5.5 0 00-.1-.6L19.4 15z"
                    />
                </svg>
            ),
        },
        {
            href: "/admin/chat",
            label: "Live Chat",
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
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                </svg>
            ),
            badge: unreadCount > 0 ? unreadCount : null,
        },
    ]

    // Satu fungsi konten sidebar
    const sidebarContent = (
        <>
            {/* Sidebar Header */}
            <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
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
                        <p className="text-xs text-indigo-100">Admin Panel</p>
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
                                    isActive ? "text-blue-600" : "text-gray-400"
                                }`}
                            >
                                {item.icon}
                            </div>
                            <span>{item.label}</span>
                            {item.badge && (
                                <div className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {item.badge > 9 ? "9+" : item.badge}
                                </div>
                            )}
                            {isActive && !item.badge && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full ml-auto"></div>
                            )}
                        </button>
                    )
                })}
            </nav>

            {/* User Profile Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                            {user?.name?.charAt(0)?.toUpperCase() || "A"}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            Administrator
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

export default AdminSidebar
