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
            } else {
                setStats({
                    total_users: usersResponse.success
                        ? usersResponse.data.data?.length || 0
                        : 0,
                    active_users: usersResponse.success
                        ? usersResponse.data.data?.filter((u) => u.is_active)
                              ?.length || 0
                        : 0,
                    total_records: taxResponse.success
                        ? taxResponse.data.data?.length || 0
                        : 0,
                    lunas: taxResponse.success
                        ? taxResponse.data.data?.filter(
                              (r) => r.status === "lunas"
                          )?.length || 0
                        : 0,
                    belum_lunas: taxResponse.success
                        ? taxResponse.data.data?.filter(
                              (r) => r.status === "belum_lunas"
                          )?.length || 0
                        : 0,
                    total_tax: taxResponse.success
                        ? taxResponse.data.data?.reduce(
                              (sum, r) => sum + (r.total || 0),
                              0
                          ) || 0
                        : 0,
                    paid_tax: taxResponse.success
                        ? taxResponse.data.data
                              ?.filter((r) => r.status === "lunas")
                              ?.reduce((sum, r) => sum + (r.total || 0), 0) || 0
                        : 0,
                    unpaid_tax: 0,
                })
            }
        } catch {
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

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount)

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
        actions: (row) => [
            {
                label: "Edit",
                onClick: () =>
                    navigate(`/admin/users?edit=${row.id || row._id}`),
                color: "blue",
            },
            {
                label: "Delete",
                onClick: () => askDeleteUser(row.id || row._id),
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
        amount: (record) => formatCurrency(record.total || 0),
        actions: (record) => [
            {
                label: "View",
                onClick: () => navigate(`/admin/tax-records/${record.id}`),
                color: "blue",
            },
            {
                label: "Edit",
                onClick: () => navigate(`/admin/tax-records/${record.id}/edit`),
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
            console.log("Deleting user:", deletingUserId)
            await loadData()
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
                // Loading State - Full Screen
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Loading Dashboard...
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            Please wait while we load your data
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Welcome Section - No padding, langsung di atas */}
                    <div className="relative overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white shadow-2xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>

                            <div className="relative z-10">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
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
                                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                                                    Selamat Datang,{" "}
                                                    {user?.name || "Admin"}! 👋
                                                </h1>
                                                <p className="text-indigo-100 text-lg">
                                                    Kelola sistem Pajak Bumi dan
                                                    Bangunan dengan mudah dan
                                                    efisien
                                                </p>
                                            </div>
                                        </div>

                                        {/* Quick Stats */}
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                                <div className="text-2xl font-bold">
                                                    {stats.total_users || 0}
                                                </div>
                                                <div className="text-indigo-100 text-sm">
                                                    Total Users
                                                </div>
                                            </div>
                                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                                <div className="text-2xl font-bold">
                                                    {stats.total_records || 0}
                                                </div>
                                                <div className="text-indigo-100 text-sm">
                                                    Total Records
                                                </div>
                                            </div>
                                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                                <div className="text-2xl font-bold">
                                                    {stats.lunas || 0}
                                                </div>
                                                <div className="text-indigo-100 text-sm">
                                                    Lunas
                                                </div>
                                            </div>
                                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                                <div className="text-2xl font-bold">
                                                    {stats.belum_lunas || 0}
                                                </div>
                                                <div className="text-indigo-100 text-sm">
                                                    Belum Lunas
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="hidden lg:flex items-center gap-3 bg-white/20 rounded-2xl px-6 py-3 backdrop-blur-sm">
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
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span className="font-medium">
                                                Admin Dashboard
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content dengan padding */}
                    <div className="p-6 space-y-8">
                        {/* Enhanced Statistics Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                icon="users"
                                label="Total Users"
                                value={stats.total_users || 0}
                                color="blue"
                                isNumber
                                trend={stats.total_users > 0 ? "+12%" : "0%"}
                                trendUp={stats.total_users > 0}
                                subtitle={`${
                                    stats.active_users || 0
                                } active users`}
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
                                label="Lunas"
                                value={stats.lunas || 0}
                                color="yellow"
                                isNumber
                                trend={stats.lunas > 0 ? "+15%" : "0%"}
                                trendUp={stats.lunas > 0}
                                subtitle="Paid records"
                            />
                            <StatCard
                                icon="unpaid"
                                label="Belum Lunas"
                                value={stats.belum_lunas || 0}
                                color="red"
                                isNumber
                                trend={stats.belum_lunas > 0 ? "-5%" : "0%"}
                                trendUp={false}
                                subtitle="Unpaid records"
                            />
                        </div>

                        {/* Data Status Message */}
                        {stats.total_users === 0 &&
                            stats.total_records === 0 && (
                                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
                                            <svg
                                                className="w-5 h-5 text-blue-600 dark:text-blue-400"
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
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200">
                                                Data Kosong
                                            </h3>
                                            <p className="text-blue-700 dark:text-blue-300">
                                                Belum ada data users atau tax
                                                records. Silakan tambahkan data
                                                melalui menu yang tersedia.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                        {/* Financial Overview */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Financial Overview
                                </h3>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={selectedPeriod}
                                        onChange={(e) =>
                                            setSelectedPeriod(e.target.value)
                                        }
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="today">Today</option>
                                        <option value="week">This Week</option>
                                        <option value="month">
                                            This Month
                                        </option>
                                        <option value="year">This Year</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-6 border border-green-200 dark:border-green-800">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                                            <svg
                                                className="w-6 h-6 text-white"
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
                                        <div className="text-green-600 dark:text-green-400 text-sm font-medium">
                                            {stats.total_tax > 0
                                                ? "+15.3%"
                                                : "0%"}
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                        {formatCurrency(stats.total_tax || 0)}
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-300 text-sm">
                                        Total Tax Amount
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                                            <svg
                                                className="w-6 h-6 text-white"
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
                                        <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                                            {stats.paid_tax > 0
                                                ? "+8.7%"
                                                : "0%"}
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                        {formatCurrency(stats.paid_tax || 0)}
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-300 text-sm">
                                        Successfully Paid
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                                            <svg
                                                className="w-6 h-6 text-white"
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
                                        </div>
                                        <div className="text-orange-600 dark:text-orange-400 text-sm font-medium">
                                            {stats.unpaid_tax > 0
                                                ? "-2.1%"
                                                : "0%"}
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                        {formatCurrency(stats.unpaid_tax || 0)}
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-300 text-sm">
                                        Outstanding Amount
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

                        {/* Recent Data with Enhanced Design */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <DataTable
                                title="Recent Users"
                                icon="users"
                                data={users}
                                columns={usersColumns}
                                emptyMessage="Belum ada users terdaftar"
                                emptyIcon="users"
                                maxItems={5}
                                totalCount={users.length}
                                onViewAll={() => navigate("/admin/users")}
                            />

                            <DataTable
                                title="Recent Tax Records"
                                icon="tax"
                                data={taxRecords}
                                columns={taxRecordsColumns}
                                emptyMessage="Belum ada data pajak"
                                emptyIcon="tax"
                                maxItems={5}
                                totalCount={taxRecords.length}
                                onViewAll={() => navigate("/admin/tax-records")}
                            />
                        </div>
                    </div>

                    {confirmOpen && (
                        <ConfirmModal
                            isOpen={confirmOpen}
                            title="Hapus User"
                            message={
                                "Apakah Anda yakin ingin menghapus user ini?\nTindakan ini tidak dapat dibatalkan."
                            }
                            confirmText="Hapus"
                            cancelText="Batal"
                            onConfirm={confirmDeleteUser}
                            onCancel={() => setConfirmOpen(false)}
                        />
                    )}
                </>
            )}
        </AdminLayout>
    )
}

export default AdminDashboard
