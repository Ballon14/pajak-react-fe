import React, { useEffect, useState } from "react"
import { AdminLayout, Toast } from "../../components/ui"
import { taxRecordService } from "../../services/taxRecordService"
import { authService } from "../../services/authService"

const AdminReports = () => {
    const [toast, setToast] = useState(null)
    const [stats, setStats] = useState(null)
    const [user, setUser] = useState(null)

    const showToast = (message, type = "info") => setToast({ message, type })

    const loadData = async () => {
        try {
            const statsRes = await taxRecordService.getAdminStatistics()
            if (statsRes.success) setStats(statsRes.data)
            if (!statsRes.success)
                showToast(statsRes.message || "Gagal memuat statistik", "error")
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

    const formatCurrency = (n) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(n || 0)

    return (
        <AdminLayout user={user}>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                            Laporan (Admin)
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600">
                            Ringkasan seluruh pengguna dan distribusi status
                            pembayaran
                        </p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border">
                        <p className="text-xs sm:text-sm text-gray-500">
                            Total Records
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">
                            {stats?.total_records ?? 0}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border">
                        <p className="text-xs sm:text-sm text-gray-500">
                            Lunas
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-green-700">
                            {stats?.lunas ?? 0}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border">
                        <p className="text-xs sm:text-sm text-gray-500">
                            Belum Lunas
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-red-700">
                            {stats?.belum_lunas ?? 0}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border">
                        <p className="text-xs sm:text-sm text-gray-500">
                            Proses
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-yellow-700">
                            {stats?.proses ?? 0}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border">
                        <p className="text-xs sm:text-sm text-gray-500">
                            Total Pajak
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">
                            {formatCurrency(stats?.total_tax)}
                        </p>
                    </div>
                </div>

                {/* Payment Status Distribution */}
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                        Distribusi Status Pembayaran
                    </h3>
                    {stats ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-3 sm:space-y-4">
                                {(() => {
                                    const totalRecords =
                                        stats.total_records || 0
                                    const lunasCount = stats.lunas || 0
                                    const belumLunasCount =
                                        stats.belum_lunas || 0
                                    const prosesCount = stats.proses || 0

                                    const lunasPercentage =
                                        totalRecords > 0
                                            ? Math.round(
                                                  (lunasCount / totalRecords) *
                                                      100
                                              )
                                            : 0
                                    const belumLunasPercentage =
                                        totalRecords > 0
                                            ? Math.round(
                                                  (belumLunasCount /
                                                      totalRecords) *
                                                      100
                                              )
                                            : 0
                                    const prosesPercentage =
                                        totalRecords > 0
                                            ? Math.round(
                                                  (prosesCount / totalRecords) *
                                                      100
                                              )
                                            : 0

                                    const statusData = [
                                        {
                                            status: "Lunas",
                                            count: lunasCount,
                                            percentage: lunasPercentage,
                                            color: "bg-green-500",
                                            textColor: "text-green-700",
                                        },
                                        {
                                            status: "Belum Lunas",
                                            count: belumLunasCount,
                                            percentage: belumLunasPercentage,
                                            color: "bg-red-500",
                                            textColor: "text-red-700",
                                        },
                                        {
                                            status: "Proses",
                                            count: prosesCount,
                                            percentage: prosesPercentage,
                                            color: "bg-yellow-500",
                                            textColor: "text-yellow-700",
                                        },
                                    ]

                                    return statusData.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg"
                                        >
                                            <div className="flex items-center">
                                                <div
                                                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-2 sm:mr-3 ${item.color}`}
                                                ></div>
                                                <span className="font-medium text-gray-900 text-sm sm:text-base">
                                                    {item.status}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <p
                                                    className={`font-semibold text-sm sm:text-base ${item.textColor}`}
                                                >
                                                    {item.count} records
                                                </p>
                                                <p className="text-xs sm:text-sm text-gray-500">
                                                    {item.percentage}%
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                })()}
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="w-48 h-48 sm:w-64 sm:h-64 relative">
                                    <svg
                                        className="w-full h-full transform -rotate-90"
                                        viewBox="0 0 100 100"
                                    >
                                        {/* Add background circle */}
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            fill="transparent"
                                            stroke="#E5E7EB"
                                            strokeWidth="2"
                                        />
                                        {(() => {
                                            const totalRecords =
                                                stats.total_records || 0
                                            const lunasCount = stats.lunas || 0
                                            const belumLunasCount =
                                                stats.belum_lunas || 0
                                            const prosesCount =
                                                stats.proses || 0

                                            const lunasPercentage =
                                                totalRecords > 0
                                                    ? (lunasCount /
                                                          totalRecords) *
                                                      100
                                                    : 0
                                            const belumLunasPercentage =
                                                totalRecords > 0
                                                    ? (belumLunasCount /
                                                          totalRecords) *
                                                      100
                                                    : 0
                                            const prosesPercentage =
                                                totalRecords > 0
                                                    ? (prosesCount /
                                                          totalRecords) *
                                                      100
                                                    : 0

                                            // If no data, show empty circle
                                            if (totalRecords === 0) {
                                                return (
                                                    <circle
                                                        cx="50"
                                                        cy="50"
                                                        r="40"
                                                        fill="#F3F4F6"
                                                        stroke="#D1D5DB"
                                                        strokeWidth="2"
                                                    />
                                                )
                                            }

                                            const statusData = [
                                                {
                                                    percentage: lunasPercentage,
                                                    color: "#10B981",
                                                }, // green-500
                                                {
                                                    percentage:
                                                        belumLunasPercentage,
                                                    color: "#EF4444",
                                                }, // red-500
                                                {
                                                    percentage:
                                                        prosesPercentage,
                                                    color: "#EAB308",
                                                }, // yellow-500
                                            ]

                                            let currentAngle = 0

                                            return statusData.map(
                                                (item, index) => {
                                                    if (item.percentage === 0)
                                                        return null

                                                    const angle =
                                                        (item.percentage /
                                                            100) *
                                                        360
                                                    const largeArcFlag =
                                                        angle > 180 ? 1 : 0

                                                    const x1 =
                                                        50 +
                                                        40 *
                                                            Math.cos(
                                                                (currentAngle *
                                                                    Math.PI) /
                                                                    180
                                                            )
                                                    const y1 =
                                                        50 +
                                                        40 *
                                                            Math.sin(
                                                                (currentAngle *
                                                                    Math.PI) /
                                                                    180
                                                            )
                                                    const x2 =
                                                        50 +
                                                        40 *
                                                            Math.cos(
                                                                ((currentAngle +
                                                                    angle) *
                                                                    Math.PI) /
                                                                    180
                                                            )
                                                    const y2 =
                                                        50 +
                                                        40 *
                                                            Math.sin(
                                                                ((currentAngle +
                                                                    angle) *
                                                                    Math.PI) /
                                                                    180
                                                            )

                                                    const pathData = [
                                                        `M 50 50`,
                                                        `L ${x1} ${y1}`,
                                                        `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                                                        `Z`,
                                                    ].join(" ")

                                                    currentAngle += angle

                                                    return (
                                                        <g key={index}>
                                                            <path
                                                                d={pathData}
                                                                fill={
                                                                    item.color
                                                                }
                                                                stroke="white"
                                                                strokeWidth="1"
                                                            />
                                                            {/* Add tooltip area */}
                                                            <path
                                                                d={pathData}
                                                                fill="transparent"
                                                                stroke="transparent"
                                                                strokeWidth="20"
                                                                style={{
                                                                    cursor: "pointer",
                                                                }}
                                                                onMouseEnter={(
                                                                    e
                                                                ) => {
                                                                    e.target.style.opacity =
                                                                        "0.8"
                                                                }}
                                                                onMouseLeave={(
                                                                    e
                                                                ) => {
                                                                    e.target.style.opacity =
                                                                        "1"
                                                                }}
                                                            />
                                                        </g>
                                                    )
                                                }
                                            )
                                        })()}
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                                            <span className="text-xs sm:text-sm font-semibold text-gray-700">
                                                {stats.total_records || 0}
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
