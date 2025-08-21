import React from "react"

const ConfirmModal = ({
    isOpen,
    title = "Konfirmasi",
    message = "",
    confirmText = "Ya",
    cancelText = "Batal",
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm mx-4">
                <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h3>
                </div>
                <div className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {message}
                </div>
                <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal
