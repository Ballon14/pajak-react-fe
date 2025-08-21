import React from "react"

const StatCard = ({
    icon,
    label,
    value,
    color,
    isNumber,
    trend,
    trendUp,
    subtitle,
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
        paid: (
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
        ),
        unpaid: (
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
            </svg>
        ),
        money: (
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
            </svg>
        ),
        chart: (
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
            </svg>
        ),
    }

    const colorMap = {
        blue: {
            bg: "bg-blue-50 dark:bg-blue-900/30",
            border: "border-blue-200 dark:border-blue-800",
            icon: "text-blue-600 dark:text-blue-400",
            trend: "text-blue-600 dark:text-blue-400",
            trendBg: "bg-blue-100 dark:bg-blue-900/50",
        },
        green: {
            bg: "bg-green-50 dark:bg-green-900/30",
            border: "border-green-200 dark:border-green-800",
            icon: "text-green-600 dark:text-green-400",
            trend: "text-green-600 dark:text-green-400",
            trendBg: "bg-green-100 dark:bg-green-900/50",
        },
        yellow: {
            bg: "bg-yellow-50 dark:bg-yellow-900/30",
            border: "border-yellow-200 dark:border-yellow-800",
            icon: "text-yellow-600 dark:text-yellow-400",
            trend: "text-yellow-600 dark:text-yellow-400",
            trendBg: "bg-yellow-100 dark:bg-yellow-900/50",
        },
        red: {
            bg: "bg-red-50 dark:bg-red-900/30",
            border: "border-red-200 dark:border-red-800",
            icon: "text-red-600 dark:text-red-400",
            trend: "text-red-600 dark:text-red-400",
            trendBg: "bg-red-100 dark:bg-red-900/50",
        },
        purple: {
            bg: "bg-purple-50 dark:bg-purple-900/30",
            border: "border-purple-200 dark:border-purple-800",
            icon: "text-purple-600 dark:text-purple-400",
            trend: "text-purple-600 dark:text-purple-400",
            trendBg: "bg-purple-100 dark:bg-purple-900/50",
        },
        orange: {
            bg: "bg-orange-50 dark:bg-orange-900/30",
            border: "border-orange-200 dark:border-orange-800",
            icon: "text-orange-600 dark:text-orange-400",
            trend: "text-orange-600 dark:text-orange-400",
            trendBg: "bg-orange-100 dark:bg-orange-900/50",
        },
    }

    const formatValue = (value) => {
        if (isNumber) {
            return value.toLocaleString()
        }
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value)
    }

    const colors = colorMap[color] || colorMap.blue

    return (
        <div
            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border ${colors.border} hover:shadow-xl transition-all duration-300 group`}
        >
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div
                        className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                    >
                        <div className={colors.icon}>{iconMap[icon]}</div>
                    </div>
                    {trend && (
                        <div
                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${colors.trendBg} ${colors.trend}`}
                        >
                            <svg
                                className={`w-3 h-3 ${
                                    trendUp ? "rotate-0" : "rotate-180"
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                />
                            </svg>
                            {trend}
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                        {formatValue(value)}
                    </div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {label}
                    </div>
                    {subtitle && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            {subtitle}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default StatCard
