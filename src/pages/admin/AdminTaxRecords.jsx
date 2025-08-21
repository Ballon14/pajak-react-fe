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
        console.log("Delete record:", recordId)
    }

    // Calculate counts for filter buttons
    const pendingCount = records.filter(
        (r) => r.status === "belum_lunas"
    ).length
    const processingCount = records.filter((r) => r.status === "proses").length
    const completedCount = records.filter((r) => r.status === "lunas").length

    return (
        <AdminLayout user={user}>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Manajemen Catatan Pajak
                        </h1>
                        <p className="text-gray-600">
                            Kelola semua catatan pajak dalam sistem
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/admin/tax-records/create")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
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
                        Tambah Catatan
                    </button>
                </div>

                {/* Quick Status Overview */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                        Filter Cepat
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="text-2xl font-bold text-red-700">
                                {pendingCount}
                            </div>
                            <div className="text-sm text-red-600">
                                Belum Bayar
                            </div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-700">
                                {processingCount}
                            </div>
                            <div className="text-sm text-yellow-600">
                                Sedang Diproses
                            </div>
                        </div>
                        <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="text-2xl font-bold text-green-700">
                                {completedCount}
                            </div>
                            <div className="text-sm text-green-600">
                                Selesai
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tax Records Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Daftar Catatan Pajak
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nama
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Jenis Pajak
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tahun
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Jumlah
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {records.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-12 text-center"
                                        >
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Belum ada catatan pajak
                                            </h3>
                                            <p className="text-gray-500">
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
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {record.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {record.address}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {record.tax_type}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {record.year}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    Rp{" "}
                                                    {record.amount?.toLocaleString(
                                                        "id-ID"
                                                    ) || "0"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
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
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/tax-records/${record.id}`
                                                        )
                                                    }
                                                    className="text-blue-600 hover:text-blue-900 mr-3 transition-colors"
                                                >
                                                    Detail
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/tax-records/edit/${record.id}`
                                                        )
                                                    }
                                                    className="text-green-600 hover:text-green-900 mr-3 transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteRecord(
                                                            record.id
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-900 transition-colors"
                                                >
                                                    Hapus
                                                </button>
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
