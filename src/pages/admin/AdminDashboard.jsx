import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../../services/authService"
import { userService } from "../../services/userService"
import { taxRecordService } from "../../services/taxRecordService"
import {
    AdminLayout,
    StatCard,
    QuickActionCard,
    DataTable,
    ConfirmModal,
} from "../../components/ui"

const AdminDashboard = () => {
    const [user, setUser] = useState(null)
    const [users, setUsers] = useState([])
    const [taxRecords, setTaxRecords] = useState([])
    const [stats, setStats] = useState({
        total_users: 0,
        active_users: 0,
        total_records: 0,
        lunas: 0,
        belum_lunas: 0,
        total_tax: 0,
        paid_tax: 0,
        unpaid_tax: 0,
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedPeriod, setSelectedPeriod] = useState("month")
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [deletingUserId, setDeletingUserId] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const userData = authService.getUserFromStorage()
        setUser(userData)
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const [usersResponse, taxResponse, statsResponse] =
                await Promise.all([
                    userService.getUsers(),
                    taxRecordService.getTaxRecords(),
                    taxRecordService.getAdminStatistics(),
                ])

            if (usersResponse.success) {
                setUsers(usersResponse.data.data || [])
            }

            if (taxResponse.success) {
                setTaxRecords(taxResponse.data.data || [])
            }

            if (statsResponse.success) {
                setStats(statsResponse.data)
                setError(null) // Clear any previous errors
            } else {
                // Fallback calculation if stats endpoint fails
                const usersData = usersResponse.success
                    ? usersResponse.data.data || []
                    : []
                const taxData = taxResponse.success
                    ? taxResponse.data.data || []
                    : []

                const totalTax = taxData.reduce(
                    (sum, r) => sum + (r.amount || r.total || 0),
                    0
                )
                const paidTax = taxData
                    .filter((r) => r.status === "lunas")
                    .reduce((sum, r) => sum + (r.amount || r.total || 0), 0)
                const unpaidTax = totalTax - paidTax

                setStats({
                    total_users: usersData.length,
                    active_users: usersData.filter((u) => u.is_active).length,
                    total_records: taxData.length,
                    lunas: taxData.filter((r) => r.status === "lunas").length,
                    belum_lunas: taxData.filter(
                        (r) => r.status === "belum_lunas"
                    ).length,
                    total_tax: totalTax,
                    paid_tax: paidTax,
                    unpaid_tax: unpaidTax,
                })
            }
        } catch (error) {
            console.error("Error loading dashboard data:", error)
            setError("Gagal memuat data dashboard. Silakan coba lagi.")
            setStats({
                total_users: 0,
                active_users: 0,
                total_records: 0,
                lunas: 0,
                belum_lunas: 0,
                total_tax: 0,
                paid_tax: 0,
                unpaid_tax: 0,
            })
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (amount) => {
        if (!amount || isNaN(amount)) return "Rp 0"
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount)
    }

    const usersColumns = {
        avatar: (user) => (
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
            </div>
        ),
        primary: (user) => user.name,
        secondary: (user) => user.email,
        badge: (user) => ({
            text: user.is_active ? "Active" : "Inactive",
            color: user.is_active ? "green" : "red",
        }),
        amount: null,
        actions: () => [
            {
                label: "Edit",
                onClick: (item) =>
                    navigate(`/admin/users?edit=${item.id || item._id}`),
                color: "blue",
            },
            {
                label: "Delete",
                onClick: (item) => askDeleteUser(item.id || item._id),
                color: "red",
            },
        ],
    }

    const taxRecordsColumns = {
        avatar: (record) => (
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                    {record.name?.charAt(0)?.toUpperCase() || "T"}
                </span>
            </div>
        ),
        primary: (record) => record.name,
        secondary: (record) => `${record.tax_type} - ${record.year}`,
        badge: (record) => ({
            text: record.status === "lunas" ? "Lunas" : "Belum Lunas",
            color: record.status === "lunas" ? "green" : "red",
        }),
        amount: (record) => formatCurrency(record.amount || record.total || 0),
        actions: () => [
            {
                label: "View",
                onClick: (item) =>
                    navigate(`/admin/tax-records/${item.id || item._id}`),
                color: "blue",
            },
            {
                label: "Edit",
                onClick: (item) =>
                    navigate(`/admin/tax-records/${item.id || item._id}/edit`),
                color: "yellow",
            },
        ],
    }

    const askDeleteUser = (userId) => {
        setDeletingUserId(userId)
        setConfirmOpen(true)
    }

    const confirmDeleteUser = async () => {
        try {
            if (deletingUserId) {
                await userService.deleteUser(deletingUserId)
                await loadData() // Reload data after deletion
            }
        } catch (error) {
            console.error("Error deleting user:", error)
        } finally {
            setConfirmOpen(false)
            setDeletingUserId(null)
        }
    }

    return (
        <AdminLayout user={user}>
            {loading ? (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">
                            Memuat Dashboard...
                        </h2>
                        <p className="text-gray-500">Mohon tunggu sebentar</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-red-400"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-800">
                                        {error}
                                    </p>
                                </div>
                                <div className="ml-auto pl-3">
                                    <div className="-mx-1.5 -my-1.5">
                                        <button
                                            onClick={() => setError(null)}
                                            className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                                        >
                                            <span className="sr-only">
                                                Dismiss
                                            </span>
                                            <svg
                                                className="h-5 w-5"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Welcome Banner */}
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-4 sm:p-6 lg:p-8 text-white shadow-lg">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                            <svg
                                                className="w-5 h-5 sm:w-6 sm:h-6"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                                                Selamat Datang,{" "}
                                                {user?.name || "Admin"}! 👋
                                            </h1>
                                            <p className="text-blue-100 text-xs sm:text-sm lg:text-base">
                                                Kelola sistem pajak dengan mudah
                                                dan efisien
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={loadData}
                                        disabled={loading}
                                        className="bg-white/20 hover:bg-white/30 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm sm:text-base"
                                    >
                                        <svg
                                            className={`w-4 h-4 ${
                                                loading ? "animate-spin" : ""
                                            }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                            />
                                        </svg>
                                        <span className="hidden sm:inline">
                                            Refresh
                                        </span>
                                    </button>
                                </div>

                                {/* Quick Stats in Banner */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                                    <div className="bg-white/10 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
                                        <div className="text-lg sm:text-xl font-bold">
                                            {stats.total_users || 0}
                                        </div>
                                        <div className="text-blue-100 text-xs">
                                            Total Users
                                        </div>
                                    </div>
                                    <div className="bg-white/10 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
                                        <div className="text-lg sm:text-xl font-bold">
                                            {stats.total_records || 0}
                                        </div>
                                        <div className="text-blue-100 text-xs">
                                            Total Records
                                        </div>
                                    </div>
                                    <div className="bg-white/10 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
                                        <div className="text-lg sm:text-xl font-bold">
                                            {stats.lunas || 0}
                                        </div>
                                        <div className="text-blue-100 text-xs">
                                            Lunas
                                        </div>
                                    </div>
                                    <div className="bg-white/10 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
                                        <div className="text-lg sm:text-xl font-bold">
                                            {stats.belum_lunas || 0}
                                        </div>
                                        <div className="text-blue-100 text-xs">
                                            Belum Lunas
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        <StatCard
                            icon="users"
                            label="Total Users"
                            value={stats.total_users || 0}
                            color="blue"
                            isNumber
                            trend={stats.total_users > 0 ? "+12%" : "0%"}
                            trendUp={stats.total_users > 0}
                            subtitle={`${stats.active_users || 0} active users`}
                        />
                        <StatCard
                            icon="tax"
                            label="Total Records"
                            value={stats.total_records || 0}
                            color="green"
                            isNumber
                            trend={stats.total_records > 0 ? "+8%" : "0%"}
                            trendUp={stats.total_records > 0}
                            subtitle="Tax records"
                        />
                        <StatCard
                            icon="paid"
                            label="Pajak Lunas"
                            value={stats.paid_tax || 0}
                            color="green"
                            trend={stats.paid_tax > 0 ? "+15%" : "0%"}
                            trendUp={stats.paid_tax > 0}
                            subtitle={`${stats.lunas || 0} records`}
                        />
                        <StatCard
                            icon="unpaid"
                            label="Belum Lunas"
                            value={stats.unpaid_tax || 0}
                            color="red"
                            trend={stats.unpaid_tax > 0 ? "-5%" : "0%"}
                            trendUp={false}
                            subtitle={`${stats.belum_lunas || 0} records`}
                        />
                    </div>

                    {/* Financial Overview */}
                    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                                Ringkasan Keuangan
                            </h3>
                            <select
                                value={selectedPeriod}
                                onChange={(e) =>
                                    setSelectedPeriod(e.target.value)
                                }
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="today">Hari Ini</option>
                                <option value="week">Minggu Ini</option>
                                <option value="month">Bulan Ini</option>
                                <option value="year">Tahun Ini</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 sm:p-6 border border-green-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-xl flex items-center justify-center">
                                        <svg
                                            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
                                    <div className="text-green-600 text-xs sm:text-sm font-medium">
                                        {stats.total_tax > 0 ? "+15.3%" : "0%"}
                                    </div>
                                </div>
                                <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                                    {formatCurrency(stats.total_tax || 0)}
                                </div>
                                <div className="text-gray-600 text-xs sm:text-sm">
                                    Total Pajak
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-6 border border-blue-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                                        <svg
                                            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
                                    <div className="text-blue-600 text-xs sm:text-sm font-medium">
                                        {stats.paid_tax > 0 ? "+8.7%" : "0%"}
                                    </div>
                                </div>
                                <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                                    {formatCurrency(stats.paid_tax || 0)}
                                </div>
                                <div className="text-gray-600 text-xs sm:text-sm">
                                    Pajak Terbayar
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 sm:p-6 border border-orange-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                                        <svg
                                            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="text-orange-600 text-xs sm:text-sm font-medium">
                                        {stats.unpaid_tax > 0 ? "-2.1%" : "0%"}
                                    </div>
                                </div>
                                <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                                    {formatCurrency(stats.unpaid_tax || 0)}
                                </div>
                                <div className="text-gray-600 text-xs sm:text-sm">
                                    Belum Terbayar
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        <QuickActionCard
                            icon="users"
                            title="Kelola Users"
                            desc="Lihat dan kelola semua pengguna sistem"
                            color="blue"
                            onClick={() => navigate("/admin/users")}
                            buttonLabel="Kelola Users"
                        />
                        <QuickActionCard
                            icon="tax"
                            title="Data Pajak"
                            desc="Lihat dan kelola semua data pajak"
                            color="green"
                            onClick={() => navigate("/admin/tax-records")}
                            buttonLabel="Lihat Data"
                        />
                        <QuickActionCard
                            icon="report"
                            title="Laporan"
                            desc="Generate laporan sistem dalam berbagai format"
                            color="purple"
                            onClick={() => navigate("/admin/reports")}
                            buttonLabel="Buat Laporan"
                        />
                        <QuickActionCard
                            icon="settings"
                            title="Pengaturan"
                            desc="Konfigurasi sistem dan pengaturan admin"
                            color="gray"
                            onClick={() => navigate("/admin/settings")}
                            buttonLabel="Pengaturan"
                        />
                    </div>

                    {/* Recent Data Tables */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <DataTable
                            title="Users Terbaru"
                            icon="users"
                            data={users}
                            columns={usersColumns}
                            emptyMessage="Belum ada users terdaftar"
                            emptyIcon="users"
                            maxItems={6}
                            totalCount={users.length}
                            onViewAll={() => navigate("/admin/users")}
                            viewMode="card"
                        />

                        <DataTable
                            title="Catatan Pajak Terbaru"
                            icon="tax"
                            data={taxRecords}
                            columns={taxRecordsColumns}
                            emptyMessage="Belum ada data pajak"
                            emptyIcon="tax"
                            maxItems={6}
                            totalCount={taxRecords.length}
                            onViewAll={() => navigate("/admin/tax-records")}
                            viewMode="card"
                        />
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            {confirmOpen && (
                <ConfirmModal
                    isOpen={confirmOpen}
                    title="Hapus User"
                    message="Apakah Anda yakin ingin menghapus user ini?\nTindakan ini tidak dapat dibatalkan."
                    confirmText="Hapus"
                    cancelText="Batal"
                    onConfirm={confirmDeleteUser}
                    onCancel={() => setConfirmOpen(false)}
                />
            )}
        </AdminLayout>
    )
}

export default AdminDashboard
