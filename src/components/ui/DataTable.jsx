import React, { useState } from "react"

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
    viewMode = "table", // "table" or "card"
}) => {
    const [currentViewMode, setCurrentViewMode] = useState(viewMode)

    const iconMap = {
        users: (
            <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
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
                className="w-5 h-5 sm:w-6 sm:h-6 text-green-600"
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
                className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4"
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
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                    {iconMap[icon]}
                    {title}
                </h3>
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setCurrentViewMode("table")}
                            className={`p-1.5 sm:p-2 rounded-md transition-colors ${
                                currentViewMode === "table"
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                            title="Table View"
                        >
                            <svg
                                className="w-3 h-3 sm:w-4 sm:h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={() => setCurrentViewMode("card")}
                            className={`p-1.5 sm:p-2 rounded-md transition-colors ${
                                currentViewMode === "card"
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                            title="Card View"
                        >
                            <svg
                                className="w-3 h-3 sm:w-4 sm:h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                />
                            </svg>
                        </button>
                    </div>

                    {totalCount !== undefined && (
                        <span className="text-xs sm:text-sm text-gray-500">
                            {totalCount} total
                        </span>
                    )}
                    {onViewAll && data.length > maxItems && (
                        <button
                            onClick={onViewAll}
                            className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Lihat Semua
                        </button>
                    )}
                </div>
            </div>

            {data.length > 0 ? (
                currentViewMode === "table" ? (
                    <div className="space-y-2 sm:space-y-3">
                        {displayData.map((item, index) => (
                            <DataRow
                                key={item.id || index}
                                item={item}
                                columns={columns}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                        {displayData.map((item, index) => (
                            <DataCard
                                key={item.id || index}
                                item={item}
                                columns={columns}
                            />
                        ))}
                    </div>
                )
            ) : (
                <div className="text-center py-6 sm:py-8">
                    {iconMap[emptyIcon] || iconMap.empty}
                    <p className="text-gray-500 text-sm">{emptyMessage}</p>
                </div>
            )}
        </div>
    )
}

const DataRow = ({ item, columns }) => {
    return (
        <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition">
            <div className="flex items-center gap-1 sm:gap-2">
                {columns.avatar && (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center">
                        {typeof columns.avatar === "function" ? (
                            columns.avatar(item)
                        ) : (
                            <div
                                className={`w-8 h-8 sm:w-10 sm:h-10 ${
                                    columns.avatar.bgColor ||
                                    "bg-gradient-to-r from-blue-500 to-purple-500"
                                } rounded-full flex items-center justify-center`}
                            >
                                <span className="text-white font-bold text-xs sm:text-sm">
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
                        <div className="font-medium text-gray-900 text-xs sm:text-sm">
                            {typeof columns.primary === "function"
                                ? columns.primary(item)
                                : columns.primary.getValue
                                ? columns.primary.getValue(item)
                                : columns.primary}
                        </div>
                    )}
                    {columns.secondary && (
                        <div className="text-xs text-gray-500">
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
                    <span className="text-xs sm:text-sm font-medium text-gray-900">
                        {typeof columns.amount === "function"
                            ? columns.amount(item)
                            : columns.amount.getValue
                            ? columns.amount.getValue(item)
                            : columns.amount}
                    </span>
                )}
                {columns.actions && (
                    <div className="flex items-center gap-0.5 sm:gap-1">
                        {(typeof columns.actions === "function"
                            ? columns.actions(item)
                            : columns.actions
                        ).map((action, index) => (
                            <button
                                key={index}
                                onClick={() => action.onClick(item)}
                                className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                                    action.color === "blue"
                                        ? "text-blue-600 hover:bg-blue-50"
                                        : action.color === "red"
                                        ? "text-red-600 hover:bg-red-50"
                                        : action.color === "green"
                                        ? "text-green-600 hover:bg-green-50"
                                        : action.color === "yellow"
                                        ? "text-yellow-600 hover:bg-yellow-50"
                                        : "text-gray-600 hover:bg-gray-50"
                                }`}
                                title={action.label}
                            >
                                {action.icon ? (
                                    action.icon
                                ) : (
                                    <ActionIcon
                                        type={action.label.toLowerCase()}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

const DataCard = ({ item, columns }) => {
    return (
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 hover:bg-blue-50 transition-all duration-200 border border-gray-100 hover:border-blue-200">
            <div className="flex items-start justify-between mb-3">
                {columns.avatar && (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center">
                        {typeof columns.avatar === "function" ? (
                            columns.avatar(item)
                        ) : (
                            <div
                                className={`w-10 h-10 sm:w-12 sm:h-12 ${
                                    columns.avatar.bgColor ||
                                    "bg-gradient-to-r from-blue-500 to-purple-500"
                                } rounded-full flex items-center justify-center`}
                            >
                                <span className="text-white font-bold text-xs sm:text-sm">
                                    {columns.avatar.getValue
                                        ? columns.avatar.getValue(item)
                                        : columns.avatar.text || "U"}
                                </span>
                            </div>
                        )}
                    </div>
                )}
                <div className="flex items-center gap-0.5 sm:gap-1">
                    {columns.badge && (
                        <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${(() => {
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
                </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                {columns.primary && (
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">
                        {typeof columns.primary === "function"
                            ? columns.primary(item)
                            : columns.primary.getValue
                            ? columns.primary.getValue(item)
                            : columns.primary}
                    </div>
                )}
                {columns.secondary && (
                    <div className="text-xs sm:text-sm text-gray-600">
                        {typeof columns.secondary === "function"
                            ? columns.secondary(item)
                            : columns.secondary.getValue
                            ? columns.secondary.getValue(item)
                            : columns.secondary}
                    </div>
                )}
                {columns.amount && (
                    <div className="text-base sm:text-lg font-bold text-gray-900">
                        {typeof columns.amount === "function"
                            ? columns.amount(item)
                            : columns.amount.getValue
                            ? columns.amount.getValue(item)
                            : columns.amount}
                    </div>
                )}
            </div>

            {columns.actions && (
                <div className="flex items-center justify-end gap-0.5 sm:gap-1 pt-2 border-t border-gray-200">
                    {(typeof columns.actions === "function"
                        ? columns.actions(item)
                        : columns.actions
                    ).map((action, index) => (
                        <button
                            key={index}
                            onClick={() => action.onClick(item)}
                            className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                                action.color === "blue"
                                    ? "text-blue-600 hover:bg-blue-50"
                                    : action.color === "red"
                                    ? "text-red-600 hover:bg-red-50"
                                    : action.color === "green"
                                    ? "text-green-600 hover:bg-green-50"
                                    : action.color === "yellow"
                                    ? "text-yellow-600 hover:bg-yellow-50"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`}
                            title={action.label}
                        >
                            {action.icon ? (
                                action.icon
                            ) : (
                                <ActionIcon type={action.label.toLowerCase()} />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

const ActionIcon = ({ type }) => {
    const iconMap = {
        edit: (
            <svg
                className="w-3 h-3 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
            </svg>
        ),
        delete: (
            <svg
                className="w-3 h-3 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
            </svg>
        ),
        view: (
            <svg
                className="w-3 h-3 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
            </svg>
        ),
        default: (
            <svg
                className="w-3 h-3 sm:w-4 sm:h-4"
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
        ),
    }

    return iconMap[type] || iconMap.default
}

export default DataTable
