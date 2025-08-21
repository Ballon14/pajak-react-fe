import React, { useEffect, useState } from "react"
import { AdminLayout, Toast } from "../../components/ui"
import { taxRecordService } from "../../services/taxRecordService"
import { reportService } from "../../services/reportService"
import { authService } from "../../services/authService"

const AdminReports = () => {
    const [toast, setToast] = useState(null)
    const [dateRange, setDateRange] = useState("this_year")
    const [stats, setStats] = useState(null)
    const [propertyData, setPropertyData] = useState([])
    const [user, setUser] = useState(null)

    const showToast = (message, type = "info") => setToast({ message, type })

    const loadData = async () => {
        try {
            const [statsRes, propertyRes] = await Promise.all([
                taxRecordService.getAdminStatistics(),
                reportService.getProperty(dateRange),
            ])
            if (statsRes.success) setStats(statsRes.data)
            if (propertyRes.success) setPropertyData(propertyRes.data || [])
            if (!statsRes.success)
                showToast(statsRes.message || "Gagal memuat statistik", "error")
            if (!propertyRes.success)
                showToast(
                    propertyRes.message || "Gagal memuat data properti",
                    "error"
                )
        } catch (err) {
            showToast(err.message || "Gagal memuat laporan", "error")
        }
    }

    useEffect(() => {
        const userData = authService.getUserFromStorage()
        setUser(userData)
        loadData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        loadData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateRange])

    const formatCurrency = (n) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(n || 0)

    return (
        <AdminLayout user={user}>
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Laporan (Admin)
                        </h1>
                        <p className="text-gray-600">
                            Ringkasan seluruh pengguna dan distribusi
                            berdasarkan jenis
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                        >
                            <option value="this_month">Bulan Ini</option>
                            <option value="last_month">Bulan Lalu</option>
                            <option value="this_quarter">Kuartal Ini</option>
                            <option value="this_year">Tahun Ini</option>
                            <option value="last_year">Tahun Lalu</option>
                        </select>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 border">
                        <p className="text-sm text-gray-500">Total Records</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {stats?.total_records ?? 0}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 border">
                        <p className="text-sm text-gray-500">Lunas</p>
                        <p className="text-2xl font-bold text-green-700">
                            {stats?.lunas ?? 0}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 border">
                        <p className="text-sm text-gray-500">Belum Lunas</p>
                        <p className="text-2xl font-bold text-red-700">
                            {stats?.belum_lunas ?? 0}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 border">
                        <p className="text-sm text-gray-500">Total Pajak</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(stats?.total_tax)}
                        </p>
                    </div>
                </div>

                {/* Property Distribution */}
                <div className="bg-white rounded-xl shadow-lg p-6 border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Distribusi Berdasarkan Jenis
                    </h3>
                    {propertyData && propertyData.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                {propertyData.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex items-center">
                                            <div
                                                className={`w-4 h-4 rounded-full mr-3 ${
                                                    [
                                                        "bg-blue-500",
                                                        "bg-green-500",
                                                        "bg-yellow-500",
                                                        "bg-purple-500",
                                                    ][idx % 4]
                                                }`}
                                            ></div>
                                            <span className="font-medium text-gray-900">
                                                {item.property}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">
                                                {formatCurrency(item.amount)}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {item.percentage}%
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="w-64 h-64 relative">
                                    <div className="w-full h-full rounded-full border-8 border-gray-200 relative overflow-hidden">
                                        {propertyData.map((item, index) => {
                                            const colors = [
                                                "bg-blue-500",
                                                "bg-green-500",
                                                "bg-yellow-500",
                                                "bg-purple-500",
                                            ]
                                            const color =
                                                colors[index % colors.length]
                                            const percentage = item.percentage
                                            const startAngle =
                                                index === 0
                                                    ? 0
                                                    : propertyData
                                                          .slice(0, index)
                                                          .reduce(
                                                              (s, it) =>
                                                                  s +
                                                                  it.percentage,
                                                              0
                                                          ) * 3.6
                                            const clip = `polygon(50% 50%, 50% 0%, ${
                                                50 +
                                                Math.cos(
                                                    ((startAngle +
                                                        percentage * 3.6) *
                                                        Math.PI) /
                                                        180
                                                ) *
                                                    50
                                            }% ${
                                                50 +
                                                Math.sin(
                                                    ((startAngle +
                                                        percentage * 3.6) *
                                                        Math.PI) /
                                                        180
                                                ) *
                                                    50
                                            }%, ${
                                                50 +
                                                Math.cos(
                                                    (startAngle * Math.PI) / 180
                                                ) *
                                                    50
                                            }% ${
                                                50 +
                                                Math.sin(
                                                    (startAngle * Math.PI) / 180
                                                ) *
                                                    50
                                            }%)`
                                            return (
                                                <div
                                                    key={index}
                                                    className={`absolute inset-0 ${color}`}
                                                    style={{ clipPath: clip }}
                                                />
                                            )
                                        })}
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                                            <span className="text-sm font-semibold text-gray-700">
                                                Total
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-8">
                            Tidak ada data
                        </div>
                    )}
                </div>

                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </div>
        </AdminLayout>
    )
}

export default AdminReports
