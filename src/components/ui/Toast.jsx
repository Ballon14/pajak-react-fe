import React, { useState, useEffect } from "react"

const Toast = ({
    message,
    type = "info", // 'success', 'error', 'warning', 'info'
    duration = 3000,
    onClose,
}) => {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
            setTimeout(() => {
                onClose?.()
            }, 300) // Wait for fade out animation
        }, duration)

        return () => clearTimeout(timer)
    }, [duration, onClose])

    const getToastStyles = () => {
        const baseStyles =
            "fixed top-4 right-4 z-50 max-w-sm w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border-l-4 p-4 transform transition-all duration-300"

        switch (type) {
            case "success":
                return `${baseStyles} border-green-500`
            case "error":
                return `${baseStyles} border-red-500`
            case "warning":
                return `${baseStyles} border-yellow-500`
            case "info":
            default:
                return `${baseStyles} border-blue-500`
        }
    }

    const getIcon = () => {
        switch (type) {
            case "success":
                return (
                    <svg
                        className="w-5 h-5 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                )
            case "error":
                return (
                    <svg
                        className="w-5 h-5 text-red-500"
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
                )
            case "warning":
                return (
                    <svg
                        className="w-5 h-5 text-yellow-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                    </svg>
                )
            case "info":
            default:
                return (
                    <svg
                        className="w-5 h-5 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                )
        }
    }

    const getMessageColor = () => {
        switch (type) {
            case "success":
                return "text-green-800 dark:text-green-200"
            case "error":
                return "text-red-800 dark:text-red-200"
            case "warning":
                return "text-yellow-800 dark:text-yellow-200"
            case "info":
            default:
                return "text-blue-800 dark:text-blue-200"
        }
    }

    if (!isVisible) return null

    return (
        <div
            className={`${getToastStyles()} ${
                isVisible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0"
            }`}
        >
            <div className="flex items-start">
                <div className="flex-shrink-0">{getIcon()}</div>
                <div className="ml-3 flex-1">
                    <p className={`text-sm font-medium ${getMessageColor()}`}>
                        {message}
                    </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                    <button
                        onClick={() => {
                            setIsVisible(false)
                            setTimeout(() => onClose?.(), 300)
                        }}
                        className="inline-flex text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:text-gray-600 dark:focus:text-gray-300 transition-colors duration-200"
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
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Toast
