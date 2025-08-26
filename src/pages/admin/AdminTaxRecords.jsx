import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AdminLayout } from "../../components/ui"
import { authService } from "../../services/authService"
import { taxRecordService } from "../../services/taxRecordService"

const AdminTaxRecords = () => {
    const [user, setUser] = useState(null)
    const [records, setRecords] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        const userData = authService.getUserFromStorage()
        setUser(userData)
        loadRecords()
    }, [])

    const loadRecords = async () => {
        try {
            const response = await taxRecordService.getTaxRecords()
            if (response.success) {
                setRecords(response.data.data || [])
            } else {
                console.error("Failed to load tax records:", response.message)
            }
        } catch (error) {
            console.error("Error loading tax records:", error)
        }
    }

    const handleDeleteRecord = (recordId) => {
        // TODO: Implement delete functionality
    }

    // Calculate counts for filter buttons
    const pendingCount = records.filter(
        (r) => r.status === "belum_lunas"
    ).length
    const processingCount = records.filter((r) => r.status === "proses").length
    const completedCount = records.filter((r) => r.status === "lunas").length

    return (
        <AdminLayout user={user}>
            <div className="space-y-4 sm:space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                            Manajemen Catatan Pajak
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600">
                            Kelola semua catatan pajak dalam sistem
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/admin/tax-records/create")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 text-sm sm:text-base"
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
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                        <span className="hidden sm:inline">Tambah Catatan</span>
                        <span className="sm:hidden">Tambah</span>
                    </button>
                </div>

                {/* Quick Status Overview */}
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
                        Filter Cepat
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        <div className="text-center p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="text-xl sm:text-2xl font-bold text-red-700">
                                {pendingCount}
                            </div>
                            <div className="text-xs sm:text-sm text-red-600">
                                Belum Bayar
                            </div>
                        </div>
                        <div className="text-center p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="text-xl sm:text-2xl font-bold text-yellow-700">
                                {processingCount}
                            </div>
                            <div className="text-xs sm:text-sm text-yellow-600">
                                Sedang Diproses
                            </div>
                        </div>
                        <div className="text-center p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="text-xl sm:text-2xl font-bold text-green-700">
                                {completedCount}
                            </div>
                            <div className="text-xs sm:text-sm text-green-600">
                                Selesai
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tax Records Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                            Daftar Catatan Pajak
                        </h3>
                    </div>

                    {/* Mobile Card View */}
                    <div className="block sm:hidden">
                        {records.length === 0 ? (
                            <div className="px-4 py-12 text-center">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400"
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
                                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                                    Belum ada catatan pajak
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Mulai dengan menambahkan catatan pajak
                                    pertama
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {records.map((record) => (
                                    <div
                                        key={record.id}
                                        className="p-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-gray-900 mb-1">
                                                    {record.name}
                                                </div>
                                                <div className="text-xs text-gray-500 mb-2">
                                                    {record.address}
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-gray-600">
                                                    <span>
                                                        {record.tax_type}
                                                    </span>
                                                    <span>{record.year}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <div className="text-sm font-medium text-gray-900">
                                                    Rp{" "}
                                                    {record.amount?.toLocaleString(
                                                        "id-ID"
                                                    ) || "0"}
                                                </div>
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        record.status ===
                                                        "lunas"
                                                            ? "bg-green-100 text-green-800"
                                                            : record.status ===
                                                              "proses"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {record.status === "lunas"
                                                        ? "Lunas"
                                                        : record.status ===
                                                          "proses"
                                                        ? "Proses"
                                                        : "Belum Lunas"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/tax-records/${record.id}`
                                                    )
                                                }
                                                className="p-1.5 sm:p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View Detail"
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
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/tax-records/${record.id}/edit`
                                                    )
                                                }
                                                className="p-1.5 sm:p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Edit Record"
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
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeleteRecord(
                                                        record.id
                                                    )
                                                }
                                                className="p-1.5 sm:p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Record"
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
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nama
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Jenis Pajak
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tahun
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Jumlah
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {records.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-4 sm:px-6 py-12 text-center"
                                        >
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg
                                                    className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400"
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
                                            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                                                Belum ada catatan pajak
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Mulai dengan menambahkan catatan
                                                pajak pertama
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    records.map((record) => (
                                        <tr
                                            key={record.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {record.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {record.address}
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {record.tax_type}
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {record.year}
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    Rp{" "}
                                                    {record.amount?.toLocaleString(
                                                        "id-ID"
                                                    ) || "0"}
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        record.status ===
                                                        "lunas"
                                                            ? "bg-green-100 text-green-800"
                                                            : record.status ===
                                                              "proses"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {record.status === "lunas"
                                                        ? "Lunas"
                                                        : record.status ===
                                                          "proses"
                                                        ? "Proses"
                                                        : "Belum Lunas"}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/admin/tax-records/${record.id}`
                                                            )
                                                        }
                                                        className="p-1.5 sm:p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="View Detail"
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
                                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                            />
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                            />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/admin/tax-records/${record.id}/edit`
                                                            )
                                                        }
                                                        className="p-1.5 sm:p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Edit Record"
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
                                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                            />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteRecord(
                                                                record.id
                                                            )
                                                        }
                                                        className="p-1.5 sm:p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete Record"
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
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminTaxRecords
