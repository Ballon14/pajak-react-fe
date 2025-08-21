import React from "react"

const QuickActionCard = ({
    icon,
    title,
    desc,
    color,
    onClick,
    buttonLabel,
    disabled = false,
}) => {
    const iconMap = {
        users: (
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
            </svg>
        ),
        tax: (
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
            </svg>
        ),
        report: (
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
                    d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
            </svg>
        ),
        plus: (
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
            </svg>
        ),
        list: (
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
                    d="M4 6h16M4 12h16M4 18h7"
                />
            </svg>
        ),
        settings: (
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
            </svg>
        ),
    }

    const colorMap = {
        blue: {
            bg: "bg-blue-50 dark:bg-blue-900/30",
            border: "border-blue-200 dark:border-blue-800",
            icon: "text-blue-600 dark:text-blue-400",
            button: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white",
            hover: "hover:bg-blue-100 dark:hover:bg-blue-900/50",
        },
        green: {
            bg: "bg-green-50 dark:bg-green-900/30",
            border: "border-green-200 dark:border-green-800",
            icon: "text-green-600 dark:text-green-400",
            button: "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white",
            hover: "hover:bg-green-100 dark:hover:bg-green-900/50",
        },
        purple: {
            bg: "bg-purple-50 dark:bg-purple-900/30",
            border: "border-purple-200 dark:border-purple-800",
            icon: "text-purple-600 dark:text-purple-400",
            button: "bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white",
            hover: "hover:bg-purple-100 dark:hover:bg-purple-900/50",
        },
        gray: {
            bg: "bg-gray-50 dark:bg-gray-700",
            border: "border-gray-200 dark:border-gray-600",
            icon: "text-gray-600 dark:text-gray-400",
            button: "bg-gray-600 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-700 text-white",
            hover: "hover:bg-gray-100 dark:hover:bg-gray-600",
        },
        yellow: {
            bg: "bg-yellow-50 dark:bg-yellow-900/30",
            border: "border-yellow-200 dark:border-yellow-800",
            icon: "text-yellow-600 dark:text-yellow-400",
            button: "bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-800 text-white",
            hover: "hover:bg-yellow-100 dark:hover:bg-yellow-900/50",
        },
        red: {
            bg: "bg-red-50 dark:bg-red-900/30",
            border: "border-red-200 dark:border-red-800",
            icon: "text-red-600 dark:text-red-400",
            button: "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white",
            hover: "hover:bg-red-100 dark:hover:bg-red-900/50",
        },
    }

    const colors = colorMap[color] || colorMap.blue

    return (
        <div
            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border ${colors.border} hover:shadow-xl transition-all duration-300 group ${colors.hover}`}
        >
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div
                        className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                    >
                        <div className={colors.icon}>{iconMap[icon]}</div>
                    </div>
                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full group-hover:bg-gray-400 dark:group-hover:bg-gray-500 transition-colors"></div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {desc}
                    </p>

                    <button
                        onClick={onClick}
                        disabled={disabled}
                        className={`w-full mt-4 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                            colors.button
                        } ${
                            disabled
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:shadow-lg transform hover:-translate-y-0.5"
                        }`}
                    >
                        {buttonLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default QuickActionCard
