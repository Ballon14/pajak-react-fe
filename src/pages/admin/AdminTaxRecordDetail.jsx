import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AdminLayout, Toast } from "../../components/ui"
import { authService } from "../../services/authService"
import { taxRecordService } from "../../services/taxRecordService"

const AdminTaxRecordDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [record, setRecord] = useState(null)
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState(null)

    useEffect(() => {
        const userData = authService.getUserFromStorage()
        setUser(userData)
        if (id) {
            loadRecord()
        }
    }, [id])

    const showToast = (message, type = "info") => setToast({ message, type })

    const loadRecord = async () => {
        try {
            setLoading(true)
            // Use admin endpoint to get any tax record without user restrictions
            const response = await taxRecordService.getByIdAdmin(id)
            if (response.success) {
                setRecord(response.data)
            } else {
                showToast(
                    response.message || "Data pajak tidak ditemukan",
                    "error"
                )
            }
        } catch (err) {
            showToast(err.message || "Gagal memuat data pajak", "error")
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount || 0)
    }

    const formatDate = (dateString) => {
        if (!dateString) return "-"
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "lunas":
                return "bg-green-100 text-green-800"
            case "proses":
                return "bg-yellow-100 text-yellow-800"
            case "belum_lunas":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case "lunas":
                return "Lunas"
            case "proses":
                return "Proses"
            case "belum_lunas":
                return "Belum Lunas"
            default:
                return status
        }
    }

    if (loading) {
        return (
            <AdminLayout user={user}>
                <div className="p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </AdminLayout>
        )
    }

    if (!record) {
        return (
            <AdminLayout user={user}>
                <div className="p-6 text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Data Pajak Tidak Ditemukan
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Data pajak dengan ID {id} tidak ditemukan atau telah
                        dihapus.
                    </p>
                    <button
                        onClick={() => navigate("/admin/tax-records")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
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
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Kembali ke Daftar
                    </button>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout user={user}>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Detail Data Pajak
                        </h1>
                        <p className="text-gray-600">
                            Informasi lengkap data pajak
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate("/admin/tax-records")}
                            className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            title="Kembali"
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
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={() =>
                                navigate(`/admin/tax-records/${id}/edit`)
                            }
                            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            title="Edit Record"
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
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Record Details */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {record.name} - {record.tax_type}
                        </h3>
                        <p className="text-gray-600">
                            SPT: {record.spt_number}
                        </p>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                                    Informasi Dasar
                                </h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">
                                            Nama
                                        </label>
                                        <p className="text-gray-900">
                                            {record.name}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">
                                            Jenis Pajak
                                        </label>
                                        <p className="text-gray-900">
                                            {record.tax_type}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">
                                            Nomor SPT
                                        </label>
                                        <p className="text-gray-900">
                                            {record.spt_number}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">
                                            Tahun
                                        </label>
                                        <p className="text-gray-900">
                                            {record.year}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                                    Status & Keuangan
                                </h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">
                                            Status
                                        </label>
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                                record.status
                                            )}`}
                                        >
                                            {getStatusText(record.status)}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">
                                            Jumlah Pajak
                                        </label>
                                        <p className="text-2xl font-bold text-green-600">
                                            {formatCurrency(
                                                record.total || record.amount
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">
                                            Tanggal Jatuh Tempo
                                        </label>
                                        <p className="text-gray-900">
                                            {formatDate(record.due_date)}
                                        </p>
                                    </div>
                                    {record.payment_date && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">
                                                Tanggal Pembayaran
                                            </label>
                                            <p className="text-gray-900">
                                                {formatDate(
                                                    record.payment_date
                                                )}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Alamat
                                </label>
                                <p className="text-gray-900">
                                    {record.address || "-"}
                                </p>
                            </div>
                            {record.description && (
                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Deskripsi
                                    </label>
                                    <p className="text-gray-900">
                                        {record.description}
                                    </p>
                                </div>
                            )}
                            {record.notes && (
                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Catatan
                                    </label>
                                    <p className="text-gray-900">
                                        {record.notes}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* User Information */}
                        {record.user && (
                            <div className="border-t pt-6">
                                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                                    Informasi Pemilik
                                </h4>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">
                                                {record.user.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase() || "U"}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {record.user.name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {record.user.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Timestamps */}
                        <div className="border-t pt-6">
                            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                                Informasi Sistem
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <label className="text-gray-700">
                                        Dibuat pada
                                    </label>
                                    <p className="text-gray-900">
                                        {formatDate(record.created_at)}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-gray-700">
                                        Terakhir diperbarui
                                    </label>
                                    <p className="text-gray-900">
                                        {formatDate(record.updated_at)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
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

export default AdminTaxRecordDetail
