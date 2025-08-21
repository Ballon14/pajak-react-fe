import React from "react"

const DataTable = ({
    title,
    icon,
    data,
    columns,
    emptyMessage = "Tidak ada data",
    emptyIcon,
    maxItems = 5,
    totalCount,
    onViewAll,
}) => {
    const iconMap = {
        users: (
            <svg
                className="w-6 h-6 text-blue-600"
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
                className="w-6 h-6 text-green-600"
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
        empty: (
            <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
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
    }

    const displayData = data.slice(0, maxItems)

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    {iconMap[icon]}
                    {title}
                </h3>
                <div className="flex items-center gap-3">
                    {totalCount !== undefined && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {totalCount} total
                        </span>
                    )}
                    {onViewAll && data.length > maxItems && (
                        <button
                            onClick={onViewAll}
                            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                            Lihat Semua
                        </button>
                    )}
                </div>
            </div>

            {data.length > 0 ? (
                <div className="space-y-3">
                    {displayData.map((item, index) => (
                        <DataRow
                            key={item.id || index}
                            item={item}
                            columns={columns}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    {iconMap[emptyIcon] || iconMap.empty}
                    <p className="text-gray-500 dark:text-gray-400">
                        {emptyMessage}
                    </p>
                </div>
            )}
        </div>
    )
}

const DataRow = ({ item, columns }) => {
    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition">
            <div className="flex items-center gap-3">
                {columns.avatar && (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center">
                        {typeof columns.avatar === "function" ? (
                            columns.avatar(item)
                        ) : (
                            <div
                                className={`w-10 h-10 ${
                                    columns.avatar.bgColor ||
                                    "bg-gradient-to-r from-blue-500 to-purple-500"
                                } rounded-full flex items-center justify-center`}
                            >
                                <span className="text-white font-bold text-sm">
                                    {columns.avatar.getValue
                                        ? columns.avatar.getValue(item)
                                        : columns.avatar.text || "U"}
                                </span>
                            </div>
                        )}
                    </div>
                )}
                <div>
                    {columns.primary && (
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                            {typeof columns.primary === "function"
                                ? columns.primary(item)
                                : columns.primary.getValue
                                ? columns.primary.getValue(item)
                                : columns.primary}
                        </div>
                    )}
                    {columns.secondary && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            {typeof columns.secondary === "function"
                                ? columns.secondary(item)
                                : columns.secondary.getValue
                                ? columns.secondary.getValue(item)
                                : columns.secondary}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                {columns.badge && (
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${(() => {
                            const badgeData =
                                typeof columns.badge === "function"
                                    ? columns.badge(item)
                                    : columns.badge
                            return badgeData?.color === "green"
                                ? "bg-green-100 text-green-800"
                                : badgeData?.color === "red"
                                ? "bg-red-100 text-red-800"
                                : badgeData?.color === "blue"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                        })()}`}
                    >
                        {(() => {
                            const badgeData =
                                typeof columns.badge === "function"
                                    ? columns.badge(item)
                                    : columns.badge
                            return badgeData?.text
                        })()}
                    </span>
                )}
                {columns.badges &&
                    columns.badges.map((badge, index) => {
                        const badgeValue =
                            typeof badge === "function"
                                ? badge(item)
                                : badge.getValue
                                ? badge.getValue(item)
                                : badge
                        if (!badgeValue) return null

                        return (
                            <span
                                key={index}
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    badge.getClassName
                                        ? badge.getClassName(item)
                                        : "bg-gray-100 text-gray-800"
                                }`}
                            >
                                {badgeValue}
                            </span>
                        )
                    })}
                {columns.amount && (
                    <span className="text-sm font-medium text-gray-900">
                        {typeof columns.amount === "function"
                            ? columns.amount(item)
                            : columns.amount.getValue
                            ? columns.amount.getValue(item)
                            : columns.amount}
                    </span>
                )}
                {columns.actions && (
                    <div className="flex items-center gap-1">
                        {(typeof columns.actions === "function"
                            ? columns.actions(item)
                            : columns.actions
                        ).map((action, index) => (
                            <button
                                key={index}
                                onClick={() => action.onClick(item)}
                                className={`px-2 py-1 text-xs rounded transition ${
                                    action.color === "blue"
                                        ? "text-blue-600 hover:bg-blue-50"
                                        : action.color === "red"
                                        ? "text-red-600 hover:bg-red-50"
                                        : action.color === "green"
                                        ? "text-green-600 hover:bg-green-50"
                                        : "text-gray-600 hover:bg-gray-50"
                                }`}
                                title={action.label}
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default DataTable
