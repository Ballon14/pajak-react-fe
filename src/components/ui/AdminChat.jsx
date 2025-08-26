import React, { useEffect, useMemo, useRef, useState } from "react"
import { userService } from "../../services/userService"
import { messageService } from "../../services/messageService"
import { authService } from "../../services/authService"
import AdminLayout from "./AdminLayout"
import ConfirmModal from "./ConfirmModal"

const AdminChat = () => {
    const [users, setUsers] = useState([])
    const [activeUser, setActiveUser] = useState(null)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [unreadCounts, setUnreadCounts] = useState({})
    const [isListOpen, setIsListOpen] = useState(false)
    const [isAtBottom, setIsAtBottom] = useState(true)
    const [hasNewMessages, setHasNewMessages] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const listRef = useRef(null)
    const me = useMemo(() => authService.getUserFromStorage(), [])

    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = async () => {
        try {
            const res = await userService.getUsers({
                is_admin: false,
                limit: 50,
            })
            const userList = res?.data?.data || []
            setUsers(userList)

            // Load conversations to get unread counts
            const conversationsRes = await messageService.getConversations()
            if (conversationsRes.success) {
                const counts = {}
                conversationsRes.data.forEach((conv) => {
                    counts[conv.other_user._id] = conv.unread_count
                })
                setUnreadCounts(counts)
            }
        } catch (error) {
            console.error("Failed to load users:", error)
        }
    }

    const scrollToBottom = (behavior = "auto") => {
        if (listRef.current) {
            listRef.current.scrollTo({
                top: listRef.current.scrollHeight,
                behavior,
            })
        }
    }

    useEffect(() => {
        if (!activeUser) return

        const loadConversation = async () => {
            try {
                setIsLoading(true)
                const with_user_id = activeUser?.id || activeUser?._id

                // Load conversation history
                const historyResponse =
                    await messageService.getConversationHistory(with_user_id)
                if (historyResponse.success) {
                    setMessages(
                        historyResponse.data.messages.map((m) => ({
                            ...m,
                            _animate: true,
                        }))
                    )
                    setTimeout(() => scrollToBottom("auto"), 0)
                }

                // Mark conversation as seen
                await messageService.markConversationAsSeen(with_user_id)
                setUnreadCounts((prev) => ({ ...prev, [with_user_id]: 0 }))
            } catch (error) {
                console.error("Error loading conversation:", error)
            } finally {
                setIsLoading(false)
            }
        }

        loadConversation()
    }, [activeUser])

    // Polling for new messages every 5 seconds when chat is active
    useEffect(() => {
        if (!activeUser) return

        const pollInterval = setInterval(async () => {
            try {
                const with_user_id = activeUser?.id || activeUser?._id
                const historyResponse =
                    await messageService.getConversationHistory(with_user_id)

                if (historyResponse.success) {
                    const newMessages = historyResponse.data.messages
                    setMessages((prev) => {
                        // Check if there are new messages
                        if (newMessages.length > prev.length) {
                            return newMessages.map((m) => ({
                                ...m,
                                _animate: true,
                            }))
                        }
                        return prev
                    })
                }
            } catch (error) {
                console.error("Error polling for new messages:", error)
            }
        }, 5000) // Poll every 5 seconds

        return () => clearInterval(pollInterval)
    }, [activeUser])

    // Polling for unread counts every 10 seconds
    useEffect(() => {
        const pollInterval = setInterval(async () => {
            try {
                const conversationsRes = await messageService.getConversations()
                if (conversationsRes.success) {
                    const counts = {}
                    conversationsRes.data.forEach((conv) => {
                        counts[conv.other_user._id] = conv.unread_count
                    })
                    setUnreadCounts(counts)
                }
            } catch (error) {
                console.error("Error polling for unread counts:", error)
            }
        }, 10000) // Poll every 10 seconds

        return () => clearInterval(pollInterval)
    }, [])

    useEffect(() => {
        if (!messages || messages.length === 0) return
        const last = messages[messages.length - 1]
        const sentByMe = String(last.sender_id) === String(me?.id || me?._id)
        if (isAtBottom || sentByMe) {
            scrollToBottom("smooth")
            setHasNewMessages(false)
        }
    }, [messages, isAtBottom, me])

    const onListScroll = () => {
        if (!listRef.current) return
        const { scrollTop, scrollHeight, clientHeight } = listRef.current
        const distanceFromBottom = scrollHeight - (scrollTop + clientHeight)
        const atBottomNow = distanceFromBottom < 48
        setIsAtBottom(atBottomNow)
        if (atBottomNow) setHasNewMessages(false)
    }

    const sendMessage = async () => {
        if (!input.trim() || !activeUser || isSending) return

        try {
            setIsSending(true)
            const to_user_id = activeUser?.id || activeUser?._id
            const response = await messageService.sendMessage(
                to_user_id,
                input.trim()
            )

            if (response.success) {
                // Add the new message to the list
                setMessages((prev) => [...prev, response.data])
                setInput("")
            }
        } catch (error) {
            console.error("Error sending message:", error)
        } finally {
            setIsSending(false)
        }
    }

    const deleteConversation = () => {
        if (!activeUser) return
        setConfirmOpen(true)
    }

    const confirmDelete = async () => {
        if (!activeUser) return

        try {
            const with_user_id = activeUser?.id || activeUser?._id
            const response = await messageService.deleteConversation(
                with_user_id
            )

            if (response.success) {
                setMessages([])
            }
        } catch (error) {
            console.error("Error deleting conversation:", error)
        } finally {
            setConfirmOpen(false)
        }
    }

    const cancelDelete = () => setConfirmOpen(false)

    const backFromChat = () => {
        setActiveUser(null)
        setMessages([])
        setIsAtBottom(true)
    }

    const formatTime = (dateString) => {
        const date = new Date(dateString)
        const diffMs = Date.now() - date.getTime()
        const diffMin = Math.floor(diffMs / 60000)
        if (diffMin < 60) {
            if (diffMin <= 0) return "baru saja"
            return `${diffMin} menit lalu`
        }
        return date.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const renderUserList = (onItemClick) => (
        <div className="w-80 bg-white flex flex-col h-full">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                    Chat dengan Admin
                </h2>
                <p className="text-sm text-gray-500">
                    {users.length} pengguna terdaftar
                </p>
            </div>
            <div className="flex-1 overflow-y-auto">
                {users.map((user) => {
                    const userId = user.id || user._id
                    const unreadCount = unreadCounts[userId] || 0
                    const isActive =
                        (activeUser?.id || activeUser?._id) === userId
                    return (
                        <button
                            key={userId}
                            onClick={() => onItemClick(user)}
                            className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                                isActive ? "bg-blue-50 border-blue-200" : ""
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-fade-in-down">
                                            <span className="text-white font-bold text-sm">
                                                {user.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase() || "U"}
                                            </span>
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white bg-gray-400"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-900 truncate">
                                            {user.name}
                                        </div>
                                        <div className="text-sm text-gray-500 truncate">
                                            {user.email}
                                        </div>
                                    </div>
                                </div>
                                {unreadCount > 0 && (
                                    <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-fade-in-up">
                                        {unreadCount > 9 ? "9+" : unreadCount}
                                    </div>
                                )}
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )

    return (
        <AdminLayout user={me}>
            <div className="flex h-screen bg-gray-50">
                <div className="hidden md:flex md:shrink-0 border-r border-gray-200 bg-white">
                    {renderUserList((u) => setActiveUser(u))}
                </div>
                {isListOpen && (
                    <div className="fixed inset-0 z-50 md:hidden animate-fade-in-down">
                        <div
                            className="absolute inset-0 bg-black/40"
                            onClick={() => setIsListOpen(false)}
                        ></div>
                        <div className="absolute inset-y-0 left-0 w-80 bg-white shadow-xl animate-fade-in-up">
                            {renderUserList((u) => {
                                setActiveUser(u)
                                setIsListOpen(false)
                            })}
                        </div>
                    </div>
                )}

                <div className="flex-1 flex flex-col h-full">
                    <div className="md:hidden bg-white border-b border-gray-200 p-3 flex items-center gap-3 flex-shrink-0">
                        <button
                            onClick={() => setIsListOpen(true)}
                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700"
                        >
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
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                        <div className="font-semibold">
                            {activeUser
                                ? `Chat dengan ${activeUser.name}`
                                : "Pilih user untuk chat"}
                        </div>
                    </div>

                    {activeUser ? (
                        <>
                            <div className="hidden md:flex items-center gap-3 bg-white border-b border-gray-200 p-4 flex-shrink-0">
                                <button
                                    onClick={backFromChat}
                                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700"
                                    title="Kembali"
                                >
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
                                            d="M15 19l-7-7 7-7"
                                        />
                                    </svg>
                                </button>
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        {activeUser.name
                                            ?.charAt(0)
                                            ?.toUpperCase() || "U"}
                                    </span>
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">
                                        {activeUser.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {activeUser.email}
                                    </div>
                                </div>
                                <div className="ml-auto flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                    <button
                                        onClick={deleteConversation}
                                        className="p-2 rounded-lg border border-gray-300 text-red-600 hover:bg-red-50"
                                        title="Hapus riwayat"
                                    >
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
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V6a2 2 0 00-2-2H9a2 2 0 00-2 2v1m-2 0h12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-hidden">
                                <div
                                    ref={listRef}
                                    onScroll={onListScroll}
                                    className="h-full overflow-y-auto p-4 space-y-3 bg-gray-50"
                                >
                                    {messages.length === 0 ? (
                                        <div className="text-center text-gray-500 py-8 animate-fade-in-down">
                                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg
                                                    className="w-8 h-8 text-gray-400"
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
                                            </div>
                                            <p className="text-white">
                                                Mulai percakapan dengan user ini
                                            </p>
                                            <p className="text-sm">
                                                Mulai percakapan dengan mengirim
                                                pesan
                                            </p>
                                        </div>
                                    ) : (
                                        messages.map((msg) => {
                                            const mine =
                                                String(msg.sender_id) ===
                                                String(me?.id || me?._id)
                                            return (
                                                <div
                                                    key={msg._id}
                                                    className={`flex items-end ${
                                                        mine
                                                            ? "justify-end"
                                                            : "justify-start"
                                                    } gap-2`}
                                                >
                                                    {!mine && (
                                                        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center text-xs font-semibold shadow">
                                                            {activeUser.name
                                                                ?.charAt(0)
                                                                ?.toUpperCase() ||
                                                                "U"}
                                                        </div>
                                                    )}
                                                    <div
                                                        className={`relative max-w-[80%] md:max-w-md px-4 py-2 rounded-2xl shadow ${
                                                            mine
                                                                ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
                                                                : "bg-white border border-gray-200 text-gray-800"
                                                        } ${
                                                            msg._animate
                                                                ? "animate-fade-in-up"
                                                                : ""
                                                        }`}
                                                    >
                                                        <div className="text-sm">
                                                            {msg.content}
                                                        </div>
                                                        <div
                                                            className={`mt-1 text-[10px] text-right ${
                                                                mine
                                                                    ? "text-blue-100"
                                                                    : "text-gray-500"
                                                            }`}
                                                        >
                                                            {formatTime(
                                                                msg.createdAt
                                                            )}
                                                        </div>
                                                        {/* Tails */}
                                                        {mine ? (
                                                            <span className="absolute -right-1 bottom-2 w-2 h-2 rotate-45 bg-indigo-600"></span>
                                                        ) : (
                                                            <span className="absolute -left-1 bottom-2 w-2 h-2 rotate-45 bg-white border-l border-b border-gray-200"></span>
                                                        )}
                                                    </div>
                                                    {mine && (
                                                        <div className="w-7 h-7"></div>
                                                    )}
                                                </div>
                                            )
                                        })
                                    )}
                                    {isLoading && (
                                        <div className="flex justify-center py-4">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                        </div>
                                    )}
                                </div>
                                {!isAtBottom && messages.length > 0 && (
                                    <button
                                        onClick={() => {
                                            scrollToBottom("smooth")
                                            setHasNewMessages(false)
                                        }}
                                        className="absolute bottom-4 right-4 bg-white/90 backdrop-blur border border-gray-200 shadow-md px-3 py-1.5 rounded-full text-sm flex items-center gap-2 hover:bg-white animate-fade-in-up"
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
                                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                            />
                                        </svg>
                                        <span>
                                            Ke bawah
                                            {hasNewMessages ? " • Baru" : ""}
                                        </span>
                                    </button>
                                )}
                            </div>

                            <div className="bg-white border-t border-gray-200 p-3 md:p-4 flex-shrink-0">
                                <div className="flex items-center gap-2 md:gap-3">
                                    <input
                                        value={input}
                                        onChange={(e) =>
                                            setInput(e.target.value)
                                        }
                                        placeholder="Tulis pesan..."
                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input-focus"
                                        onKeyDown={(e) =>
                                            e.key === "Enter" && sendMessage()
                                        }
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={!input.trim() || isSending}
                                        aria-label="Kirim"
                                        className="p-3 rounded-full btn-gradient disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
                                    >
                                        {isSending ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        ) : (
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
                                                    d="M3 10l18-7-7 18-2.5-6.5L5 12.5 3 10z"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                    <button
                                        onClick={deleteConversation}
                                        className="hidden md:inline-flex p-3 rounded-full border border-red-200 text-red-600 hover:bg-red-50"
                                        title="Hapus riwayat"
                                    >
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
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V6a2 2 0 00-2-2H9a2 2 0 00-2 2v1m-2 0h12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {confirmOpen && (
                                <ConfirmModal
                                    isOpen={confirmOpen}
                                    title={`Hapus Chat dengan ${
                                        activeUser?.name || "User"
                                    }`}
                                    message={
                                        "Tindakan ini akan menghapus seluruh riwayat percakapan.\nAnda yakin ingin melanjutkan?"
                                    }
                                    confirmText="Hapus"
                                    cancelText="Batal"
                                    onConfirm={confirmDelete}
                                    onCancel={cancelDelete}
                                />
                            )}
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
                            <div className="text-center text-gray-500 animate-fade-in-down">
                                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        className="w-12 h-12 text-gray-400"
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
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Tidak ada pesan
                                </h3>
                                <p className="text-gray-500">
                                    Mulai percakapan dengan user ini
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminChat
