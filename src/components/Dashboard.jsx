import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "./Layout"
import { authService } from "../services/authService"
import { taxRecordService } from "../services/taxRecordService"

const Dashboard = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalTax: 0,
        paidTax: 0,
        unpaidTax: 0,
        totalRecords: 0,
        paidRecords: 0,
        unpaidRecords: 0,
    })
    const [recentActivities, setRecentActivities] = useState([])
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
            <div className="space-y-6">
                {/* Welcome Header */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Selamat Datang, {user?.name}! 👋
                            </h1>
                            <p className="text-gray-600">
                                Kelola data pajak Anda dengan mudah dan efisien
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-xl">
                                    {user?.name?.charAt(0)?.toUpperCase() ||
                                        "U"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
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
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">
                                    Total PBB
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }).format(stats.totalTax)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
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
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">
                                    Lunas
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }).format(stats.paidTax)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
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
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">
                                    Total Properti
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats.totalRecords}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
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
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">
                                    Belum Lunas
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }).format(stats.unpaidTax)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-blue-600"
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
                            </div>
                            <h3 className="ml-3 text-lg font-semibold text-gray-900">
                                Tambah Data Pajak
                            </h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Tambahkan data pajak baru untuk dikelola
                        </p>
                        <button
                            onClick={() => navigate("/tax-records")}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                        >
                            Tambah Data
                        </button>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-green-600"
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
                            <h3 className="ml-3 text-lg font-semibold text-gray-900">
                                Lihat Data Pajak
                            </h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Lihat dan kelola semua data pajak Anda
                        </p>
                        <button
                            onClick={() => navigate("/tax-records")}
                            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                        >
                            Lihat Data
                        </button>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-purple-600"
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
                            </div>
                            <h3 className="ml-3 text-lg font-semibold text-gray-900">
                                Laporan
                            </h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Generate laporan pajak dalam berbagai format
                        </p>
                        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                            Buat Laporan
                        </button>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Aktivitas Terbaru
                    </h2>

                    {recentActivities.length > 0 ? (
                        <div className="space-y-4">
                            {recentActivities.map((activity, index) => (
                                <div
                                    key={activity._id || index}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <svg
                                                className="w-5 h-5 text-blue-600"
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
                                            <h3 className="font-medium text-gray-900">
                                                {activity.tax_type} -{" "}
                                                {activity.spt_number}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {activity.description ||
                                                    `${activity.period} ${activity.year}`}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {formatDate(
                                                    activity.created_at
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                activity.status
                                            )}`}
                                        >
                                            {getStatusText(activity.status)}
                                        </span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0,
                                            }).format(activity.amount)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
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

export default Dashboard
