import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Layout } from "../../components/ui"
import { authService } from "../../services/authService"
import { taxRecordService } from "../../services/taxRecordService"

const Dashboard = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [newYearNotification, setNewYearNotification] = useState(null)
    const [stats, setStats] = useState({
        totalTax: 0,
        paidTax: 0,
        unpaidTax: 0,
        totalRecords: 0,
        paidRecords: 0,
        unpaidRecords: 0,
        outstandingAmount: 0,
        outstandingRecords: 0,
    })
    const [recentActivities, setRecentActivities] = useState([])
    const [currentActivityPage, setCurrentActivityPage] = useState(1)
    const activitiesPerPage = 5
    const navigate = useNavigate()

    useEffect(() => {
        loadDashboardData()
    }, [])

    const loadDashboardData = async () => {
        try {
            console.log("🔄 Loading dashboard data...")
            setLoading(true)

            // Get user data
            const currentUser = authService.getUserFromStorage()
            console.log("👤 Current user:", currentUser)
            if (currentUser) {
                setUser(currentUser)
            }

            // Check and auto-create tax records for new year
            console.log("📅 Checking for new year tax records...")
            try {
                const yearCheckResponse =
                    await taxRecordService.checkAndCreateForNewYear()
                console.log("📅 Year check response:", yearCheckResponse)

                if (
                    yearCheckResponse.success &&
                    yearCheckResponse.autoCreated
                ) {
                    console.log("✅ Auto-created tax records for new year")
                    setNewYearNotification({
                        message: `Data PBB untuk tahun ${new Date().getFullYear()} telah dibuat otomatis!`,
                        count: yearCheckResponse.count,
                    })
                }
            } catch (yearError) {
                console.error("❌ Error checking year:", yearError)
            }

            // Get statistics
            console.log("📊 Fetching statistics...")
            const statsResponse = await taxRecordService.getStatistics()
            console.log("📊 Statistics API Response:", {
                success: statsResponse.success,
                data: statsResponse.data,
                fullResponse: statsResponse,
            })

            if (statsResponse.success && statsResponse.data) {
                const newStats = {
                    totalTax: statsResponse.data.total_tax || 0,
                    paidTax: statsResponse.data.paid_tax || 0,
                    unpaidTax: statsResponse.data.unpaid_tax || 0,
                    totalRecords: statsResponse.data.total_records || 0,
                    paidRecords: statsResponse.data.paid_records || 0,
                    unpaidRecords: statsResponse.data.unpaid_records || 0,
                    outstandingAmount:
                        statsResponse.data.outstanding_amount || 0,
                    outstandingRecords:
                        statsResponse.data.outstanding_records || 0,
                }
                console.log("📈 Setting new stats:", newStats)
                setStats(newStats)
            } else {
                console.error("❌ Invalid statistics response:", statsResponse)
            }

            // Get recent activities (tax records)
            console.log("📋 Fetching recent activities...")
            const activitiesResponse = await taxRecordService.getAll()
            console.log("📋 Activities API Response:", {
                success: activitiesResponse.success,
                data: activitiesResponse.data,
            })

            if (activitiesResponse.success && activitiesResponse.data) {
                // Sort by created_at and take latest 5
                const sortedActivities = activitiesResponse.data
                    .sort(
                        (a, b) =>
                            new Date(b.created_at) - new Date(a.created_at)
                    )
                    .slice(0, 5)

                console.log("📋 Setting recent activities:", sortedActivities)
                setRecentActivities(sortedActivities)
            } else {
                console.error(
                    "❌ Invalid activities response:",
                    activitiesResponse
                )
            }
        } catch (error) {
            console.error("❌ Error loading dashboard data:", {
                message: error.message,
                error: error,
                stack: error.stack,
            })
        } finally {
            setLoading(false)
            console.log("✅ Dashboard loading complete")
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "lunas":
                return "text-green-600 bg-green-100"
            case "belum_lunas":
                return "text-red-600 bg-red-100"
            case "proses":
                return "text-yellow-600 bg-yellow-100"
            default:
                return "text-gray-600 bg-gray-100"
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case "lunas":
                return "Lunas"
            case "belum_lunas":
                return "Belum Lunas"
            case "proses":
                return "Proses"
            default:
                return status
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    // Pagination logic for recent activities
    const totalActivityPages = Math.ceil(
        recentActivities.length / activitiesPerPage
    )
    const paginatedActivities = recentActivities.slice(
        (currentActivityPage - 1) * activitiesPerPage,
        currentActivityPage * activitiesPerPage
    )

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="space-y-8 max-w-6xl mx-auto px-2 md:px-0">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                            Selamat Datang,{" "}
                            <span className="text-blue-700">
                                {user?.name || "User"}
                            </span>
                            </h1>
                        <p className="text-gray-500 text-sm md:text-base">
                            Kelola data Pajak Bumi dan Bangunan Anda dengan
                            mudah
                            </p>
                        </div>
                    <div className="flex items-center gap-2">
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-2xl md:text-3xl">
                                {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                </span>
                        </div>
                    </div>
                </div>

                {/* Notifikasi Tahun Baru */}
                {newYearNotification && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
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
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-green-800 mb-1">
                                Data Tahun Baru Dibuat Otomatis! 🎉
                            </h3>
                            <p className="text-green-700 text-sm">
                                {newYearNotification.message}
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                                {newYearNotification.count} data PBB telah
                                dibuat berdasarkan data tahun sebelumnya dengan
                                kenaikan 10%.
                            </p>
                        </div>
                        <button
                            onClick={() => setNewYearNotification(null)}
                            className="ml-auto text-green-600 hover:text-green-800"
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
                )}

                {/* Statistik */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <StatCard
                        icon="total"
                        label="Total PBB"
                        value={stats.totalTax}
                        color="blue"
                    />
                    <StatCard
                        icon="paid"
                        label="Lunas"
                        value={stats.paidTax}
                        color="green"
                    />
                    <StatCard
                        icon="property"
                        label="Total Properti"
                        value={stats.totalRecords}
                        color="yellow"
                        isNumber
                    />
                    <StatCard
                        icon="unpaid"
                        label="Belum Lunas"
                        value={stats.unpaidTax}
                        color="red"
                    />
                    <StatCard
                        icon="outstanding"
                        label="Tunggakan"
                        value={stats.outstandingAmount}
                        color="orange"
                        isOutstanding
                        count={stats.outstandingRecords}
                    />
                </div>

                {/* Aksi Cepat */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <QuickActionCard
                        icon="plus"
                        title="Tambah Data Pajak"
                        desc="Tambahkan data pajak baru untuk dikelola"
                        color="blue"
                        onClick={() => navigate("/tax-records/create")}
                        buttonLabel="Tambah Data"
                    />
                    <QuickActionCard
                        icon="list"
                        title="Lihat Data Pajak"
                        desc="Lihat dan kelola semua data pajak Anda"
                        color="green"
                        onClick={() => navigate("/tax-records")}
                        buttonLabel="Lihat Data"
                    />
                    <QuickActionCard
                        icon="report"
                        title="Laporan"
                        desc="Generate laporan pajak dalam berbagai format"
                        color="purple"
                        onClick={() => navigate("/reports")}
                        buttonLabel="Buat Laporan"
                    />
                </div>

                {/* Aktivitas Terbaru */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
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
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                        Aktivitas Terbaru
                    </h2>
                    {recentActivities.length > 0 ? (
                        <>
                            <div className="space-y-3">
                                {paginatedActivities.map((activity, index) => (
                                    <div
                                        key={activity._id || index}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-9 h-9 rounded-lg flex items-center justify-center ${getStatusColor(
                                                    activity.status
                                                )}`}
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
                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 text-sm md:text-base">
                                                    {activity.tax_type} -{" "}
                                                    {activity.spt_number}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {activity.description ||
                                                        `Tahun ${activity.year}`}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {formatDate(
                                                        activity.created_at
                                                    )}
                                                </div>
                                            </div>
                            </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                    activity.status
                                                )}`}
                                            >
                                                {getStatusText(activity.status)}
                                            </span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {new Intl.NumberFormat(
                                                    "id-ID",
                                                    {
                                        style: "currency",
                                        currency: "IDR",
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                                    }
                                                ).format(activity.amount)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Pagination controls */}
                            {totalActivityPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-4">
                                    <button
                                        className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                                        onClick={() =>
                                            setCurrentActivityPage((p) =>
                                                Math.max(1, p - 1)
                                            )
                                        }
                                        disabled={currentActivityPage === 1}
                                    >
                                        Previous
                                    </button>
                                    <span className="text-sm text-gray-600">
                                        Halaman {currentActivityPage} dari{" "}
                                        {totalActivityPages}
                                    </span>
                                    <button
                                        className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                                        onClick={() =>
                                            setCurrentActivityPage((p) =>
                                                Math.min(
                                                    totalActivityPages,
                                                    p + 1
                                                )
                                            )
                                        }
                                        disabled={
                                            currentActivityPage ===
                                            totalActivityPages
                                        }
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-8">
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
                            <p className="text-gray-500">
                                Belum ada aktivitas terbaru
                            </p>
                            <p className="text-sm text-gray-400">
                                Mulai dengan menambahkan data pajak pertama Anda
                            </p>
                        </div>
                    )}
                        </div>
                    </div>
        </Layout>
    )
}

// Card Statistik
function StatCard({
    icon,
    label,
    value,
    color,
    isNumber,
    isOutstanding,
    count,
}) {
    const iconMap = {
        total: (
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
            </svg>
        ),
        paid: (
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
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
        ),
        property: (
                                <svg
                                    className="w-6 h-6 text-yellow-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                    d="M3 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10m-7-4V4a2 2 0 114 0v2"
                                    />
                                </svg>
        ),
        unpaid: (
                                <svg
                                    className="w-6 h-6 text-red-600"
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
        outstanding: (
            <svg
                className="w-6 h-6 text-orange-600"
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
        ),
    }
    const colorMap = {
        blue: "bg-blue-100",
        green: "bg-green-100",
        yellow: "bg-yellow-100",
        red: "bg-red-100",
        orange: "bg-orange-100",
        purple: "bg-purple-100",
    }
    // Tentukan label jumlah data
    let dataCount = null
    if (typeof count === "number") {
        dataCount = `${count} data`
    } else if (label.toLowerCase().includes("properti")) {
        dataCount = `${value} data`
    }
    return (
        <div
            className={`bg-white rounded-xl shadow-lg p-5 border border-gray-100 flex flex-col items-start gap-2 ${
                isOutstanding ? "ring-2 ring-orange-400" : ""
            }`}
        >
            <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorMap[color]}`}
            >
                {iconMap[icon]}
                            </div>
            <p className="text-xs font-medium text-gray-500 mt-2">{label}</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900">
                {isNumber
                    ? value
                    : new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                      }).format(value)}
            </p>
            {dataCount && (
                <p
                    className={`text-xs ${
                        isOutstanding ? "text-orange-600" : "text-gray-500"
                    } mt-1`}
                >
                    {dataCount}
                </p>
            )}
                    </div>
    )
}

// Card Aksi Cepat
function QuickActionCard({ icon, title, desc, color, onClick, buttonLabel }) {
    const iconMap = {
        plus: (
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                </svg>
        ),
        list: (
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
                    d="M4 6h16M4 12h16M4 18h7"
                                    />
                                </svg>
        ),
        report: (
            <svg
                className="w-6 h-6 text-purple-600"
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
    }
    const colorMap = {
        blue: "bg-blue-100",
        green: "bg-green-100",
        purple: "bg-purple-100",
    }
    return (
        <div
            className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex flex-col items-start gap-3 hover:shadow-xl transition group`}
        >
            <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}
            >
                {iconMap[icon]}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-gray-600 text-sm flex-1">{desc}</p>
            <button
                onClick={onClick}
                className={`w-full mt-2 bg-${color}-600 hover:bg-${color}-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200`}
            >
                {buttonLabel}
            </button>
        </div>
    )
}

export default Dashboard
