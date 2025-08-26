import React, { useEffect, useMemo, useRef, useState } from "react"
import { authService } from "../../services/authService"
import { userService } from "../../services/userService"
import { messageService } from "../../services/messageService"

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [adminUser, setAdminUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const [isOnline] = useState(true) // Assume admin is online by default
    const listRef = useRef(null)
    const me = useMemo(() => authService.getUserFromStorage(), [])

    useEffect(() => {
        let mounted = true
        ;(async () => {
            try {
                const res = await userService.getAdminContact()
                if (mounted) setAdminUser(res?.data || null)
            } catch (e) {
                console.error(e)
            }
        })()
        return () => {
            mounted = false
        }
    }, [])

    useEffect(() => {
        if (!isOpen || !adminUser) return

        const loadConversation = async () => {
            try {
                setIsLoading(true)
                const with_user_id = adminUser?.id || adminUser?._id

                // Load chat history
                const historyResponse =
                    await messageService.getConversationHistory(with_user_id)
                if (historyResponse.success) {
                    setMessages(historyResponse.data.messages)
                }

                // Mark conversation as seen
                await messageService.markConversationAsSeen(with_user_id)
            } catch (error) {
                console.error("Error loading conversation:", error)
            } finally {
                setIsLoading(false)
            }
        }

        loadConversation()
    }, [isOpen, adminUser])

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight
        }
    }, [messages])

    // Polling for new messages every 5 seconds when chat is open
    useEffect(() => {
        if (!isOpen || !adminUser) return

        const pollInterval = setInterval(async () => {
            try {
                const with_user_id = adminUser?.id || adminUser?._id
                const historyResponse =
                    await messageService.getConversationHistory(with_user_id)

                if (historyResponse.success) {
                    const newMessages = historyResponse.data.messages
                    setMessages((prev) => {
                        // Check if there are new messages
                        if (newMessages.length > prev.length) {
                            return newMessages
                        }
                        return prev
                    })
                }
            } catch (error) {
                console.error("Error polling for new messages:", error)
            }
        }, 5000) // Poll every 5 seconds

        return () => clearInterval(pollInterval)
    }, [isOpen, adminUser])

    const sendMessage = async () => {
        if (!input.trim() || !adminUser || isSending) return

        try {
            setIsSending(true)
            const to_user_id = adminUser?.id || adminUser?._id
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

    if (!me) return null

    // Only show chat widget for non-admin users
    if (me.is_admin) return null

    return (
        <div className="fixed bottom-3 right-3 z-50">
            {isOpen ? (
                <div className="w-[92vw] max-w-sm sm:max-w-md md:max-w-md bg-white shadow-2xl rounded-xl border border-gray-200 flex flex-col sm:w-80 max-h-[80vh] sm:max-h-[420px] animate-fade-in-up">
                    {/* Chat Header */}
                    <div className="px-4 py-3 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">
                                            {adminUser?.name
                                                ?.charAt(0)
                                                ?.toUpperCase() || "A"}
                                        </span>
                                    </div>
                                    <div
                                        className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white ${
                                            isOnline
                                                ? "bg-green-400"
                                                : "bg-gray-400"
                                        }`}
                                    ></div>
                                </div>
                                <div>
                                    <div className="font-semibold text-sm">
                                        Live Chat
                                    </div>
                                    <div className="text-xs text-blue-100">
                                        {isOnline ? "Online" : "Offline"}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/80 hover:text-white p-1 rounded-lg transition-colors"
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
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div
                        ref={listRef}
                        className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3"
                        style={{ maxHeight: 360 }}
                    >
                        {messages.length === 0 ? (
                            <div className="text-center text-gray-500 py-8 animate-fade-in-down">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg
                                        className="w-6 h-6 text-gray-400"
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
                                <p className="text-sm">
                                    Mulai percakapan dengan admin
                                </p>
                            </div>
                        ) : (
                            messages.map((m) => {
                                const mine =
                                    String(m.sender_id) ===
                                    String(me.id || me._id)
                                return (
                                    <div
                                        key={m._id}
                                        className={`flex items-end ${
                                            mine
                                                ? "justify-end"
                                                : "justify-start"
                                        } gap-2`}
                                    >
                                        {!mine && (
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center text-[10px] font-semibold shadow">
                                                {adminUser?.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase() || "A"}
                                            </div>
                                        )}
                                        <div
                                            className={`relative max-w-[85%] px-3 py-2 rounded-2xl shadow ${
                                                mine
                                                    ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
                                                    : "bg-white border border-gray-200 text-gray-800"
                                            } animate-fade-in-up`}
                                        >
                                            <div>{m.content}</div>
                                            <div
                                                className={`mt-1 text-[10px] text-right ${
                                                    mine
                                                        ? "text-blue-100"
                                                        : "text-gray-500"
                                                }`}
                                            >
                                                {formatTime(m.createdAt)}
                                            </div>
                                            {mine ? (
                                                <span className="absolute -right-1 bottom-2 w-2 h-2 rotate-45 bg-indigo-600"></span>
                                            ) : (
                                                <span className="absolute -left-1 bottom-2 w-2 h-2 rotate-45 bg-white border-l border-b border-gray-200"></span>
                                            )}
                                        </div>
                                        {mine && (
                                            <div className="w-6 h-6"></div>
                                        )}
                                    </div>
                                )
                            })
                        )}

                        {/* Loading Indicator */}
                        {isLoading && (
                            <div className="flex justify-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            </div>
                        )}
                    </div>

                    {/* Message Input */}
                    <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                        <div className="flex gap-2 items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ketik pesan..."
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent input-focus"
                                onKeyDown={(e) =>
                                    e.key === "Enter" && sendMessage()
                                }
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!input.trim() || isSending}
                                className="btn-gradient disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed"
                            >
                                {isSending ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                    "Kirim"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full w-14 h-14 shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center animate-float"
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
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                    </svg>
                </button>
            )}
        </div>
    )
}

export default ChatWidget
