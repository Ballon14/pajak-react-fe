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
                    {/* Welcome Banner */}
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-6 lg:p-8 text-white shadow-lg">
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
                                        <h1 className="text-2xl lg:text-3xl font-bold">
                                            Selamat Datang,{" "}
                                            {user?.name || "Admin"}! 👋
                                        </h1>
                                        <p className="text-blue-100 text-sm lg:text-base">
                                            Kelola sistem pajak dengan mudah dan
                                            efisien
                                        </p>
                                    </div>
                                </div>

                                {/* Quick Stats in Banner */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
                                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                                        <div className="text-xl font-bold">
                                            {stats.total_users || 0}
                                        </div>
                                        <div className="text-blue-100 text-xs">
                                            Total Users
                                        </div>
                                    </div>
                                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                                        <div className="text-xl font-bold">
                                            {stats.total_records || 0}
                                        </div>
                                        <div className="text-blue-100 text-xs">
                                            Total Records
                                        </div>
                                    </div>
                                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                                        <div className="text-xl font-bold">
                                            {stats.lunas || 0}
                                        </div>
                                        <div className="text-blue-100 text-xs">
                                            Lunas
                                        </div>
                                    </div>
                                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                                        <div className="text-xl font-bold">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                            value={formatCurrency(stats.paid_tax || 0)}
                            color="green"
                            trend={stats.paid_tax > 0 ? "+15%" : "0%"}
                            trendUp={stats.paid_tax > 0}
                            subtitle={`${stats.lunas || 0} records`}
                        />
                        <StatCard
                            icon="unpaid"
                            label="Belum Lunas"
                            value={formatCurrency(stats.unpaid_tax || 0)}
                            color="red"
                            trend={stats.unpaid_tax > 0 ? "-5%" : "0%"}
                            trendUp={false}
                            subtitle={`${stats.belum_lunas || 0} records`}
                        />
                    </div>

                    {/* Financial Overview */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
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

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
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
                                    <div className="text-green-600 text-sm font-medium">
                                        {stats.total_tax > 0 ? "+15.3%" : "0%"}
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-gray-900 mb-1">
                                    Rp {formatCurrency(stats.total_tax || 0)}
                                </div>
                                <div className="text-gray-600 text-sm">
                                    Total Pajak
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
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
                                    <div className="text-blue-600 text-sm font-medium">
                                        {stats.paid_tax > 0 ? "+8.7%" : "0%"}
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-gray-900 mb-1">
                                    Rp {formatCurrency(stats.paid_tax || 0)}
                                </div>
                                <div className="text-gray-600 text-sm">
                                    Pajak Terbayar
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
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
                                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="text-orange-600 text-sm font-medium">
                                        {stats.unpaid_tax > 0 ? "-2.1%" : "0%"}
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-gray-900 mb-1">
                                    Rp {formatCurrency(stats.unpaid_tax || 0)}
                                </div>
                                <div className="text-gray-600 text-sm">
                                    Belum Terbayar
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
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

                    {/* Recent Data Tables */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <DataTable
                            title="Users Terbaru"
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
                            title="Catatan Pajak Terbaru"
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
