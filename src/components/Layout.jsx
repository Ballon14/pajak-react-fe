import React, { useState } from "react"
import Sidebar from "./Sidebar"

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <div className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
                    <div className="flex items-center justify-between px-4 py-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <svg
                                className="w-6 h-6 text-gray-600"
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
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
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
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-lg font-semibold text-gray-900">
                                PajakApp
                            </h1>
                        </div>
                        <div className="w-8"></div> {/* Spacer for centering */}
                    </div>
                </div>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-6">{children}</div>
                </main>
            </div>
        </div>
    )
}

export default Layout
