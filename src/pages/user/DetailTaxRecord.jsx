import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Layout, Toast } from "../../components/ui"
import { taxRecordService } from "../../services/taxRecordService"

const DetailTaxRecord = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [record, setRecord] = useState(null)
    const [toast, setToast] = useState(null)

    useEffect(() => {
        // Validate ID before loading
        if (!id || id === "undefined" || id === "null") {
            console.error("❌ Invalid ID:", id)
            showToast("ID data tidak valid", "error")
            setTimeout(() => {
                navigate("/tax-records")
            }, 1500)
            return
        }

        loadTaxRecord()
    }, [id])

    const showToast = (message, type = "info") => {
        setToast({ message, type })
    }

    const loadTaxRecord = async () => {
        try {
            setLoading(true)

            const response = await taxRecordService.getById(id)

            if (response.success && response.data) {
                const recordData = response.data
                setRecord(recordData)
            } else {
                console.error("❌ Invalid response:", response)
                showToast("Data PBB tidak ditemukan", "error")
                setTimeout(() => {
                    navigate("/tax-records")
                }, 1500)
            }
        } catch (error) {
            console.error("❌ Error loading tax record:", error)
            console.error("Error details:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            })
            showToast("Gagal memuat data PBB", "error")
            setTimeout(() => {
                navigate("/tax-records")
            }, 1500)
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
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
            case "belum_lunas":
                return "bg-red-100 text-red-800"
            case "proses":
                return "bg-yellow-100 text-yellow-800"
            default:
                return "bg-gray-100 text-gray-800"
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
                return "Tidak Diketahui"
        }
    }

    const handlePrint = () => {
        window.print()
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

    // Check if ID is valid
    if (!id || id === "undefined" || id === "null") {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <svg
                            className="w-16 h-16 text-red-300 mx-auto mb-4"
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
                        <p className="text-red-500 text-lg mb-2">
                            ID Data Tidak Valid
                        </p>
                        <p className="text-gray-400">
                            Redirecting ke halaman tax records...
                        </p>
                    </div>
                </div>
            </Layout>
        )
    }

    if (!record) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
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
                        <p className="text-gray-500 text-lg mb-2">
                            Data PBB Tidak Ditemukan
                        </p>
                        <p className="text-gray-400">
                            Data yang Anda cari tidak tersedia
                        </p>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between print:hidden">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Detail Data PBB
                        </h1>
                        <p className="text-gray-600">
                            Informasi lengkap Pajak Bumi dan Bangunan (PBB)
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => handlePrint()}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
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
                                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                />
                            </svg>
                            <span>Print Nota</span>
                        </button>
                        <button
                            onClick={() => navigate(`/tax-records/${id}/edit`)}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
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
                            <span>Edit</span>
                        </button>
                        <button
                            onClick={() => navigate("/tax-records")}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
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
                            <span>Kembali</span>
                        </button>
                    </div>
                </div>

                {/* Print Header */}
                <div className="hidden print:block print:mb-1">
                    <div className="text-center border-b border-gray-300 pb-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-1 print:text-4xl">
                            NOTA PEMBAYARAN PBB
                        </h1>
                        <p className="text-lg text-gray-600 print:text-lg">
                            Pajak Bumi dan Bangunan
                        </p>
                        <p className="text-sm text-gray-500 mt-1 print:text-sm">
                            Tanggal Cetak:{" "}
                            {new Date().toLocaleDateString("id-ID")}
                        </p>
                    </div>
                </div>

                {/* Detail Content */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 print:shadow-none print:border-none print:p-0 print:break-inside-avoid">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:gap-16">
                        {/* Left Column - Basic Info */}
                        <div className="space-y-6 print:space-y-2">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 print:text-2xl print:mb-2">
                                    Informasi Dasar
                                </h3>
                                <div className="space-y-6 print:space-y-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 print:text-sm print:mb-1 print:font-semibold">
                                            Nama
                                        </label>
                                        <p className="text-lg font-semibold text-gray-900 print:text-xl print:font-bold print:text-gray-800">
                                            {record.name || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 print:text-sm print:mb-1 print:font-semibold">
                                            Alamat
                                        </label>
                                        <p className="text-lg font-semibold text-gray-900 print:text-xl print:font-bold print:text-gray-800">
                                            {record.address || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 print:text-sm print:mb-1 print:font-semibold">
                                            Jenis Pajak
                                        </label>
                                        <p className="text-lg font-semibold text-gray-900 print:text-xl print:font-bold print:text-gray-800">
                                            {record.tax_type || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 print:text-sm print:mb-1 print:font-semibold">
                                            Nomor SPT
                                        </label>
                                        <p className="text-lg font-semibold text-gray-900 print:text-xl print:font-bold print:text-gray-800">
                                            {record.spt_number || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 print:text-sm print:mb-1 print:font-semibold">
                                            Tahun
                                        </label>
                                        <p className="text-lg font-semibold text-gray-900 print:text-xl print:font-bold print:text-gray-800">
                                            {record.year || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 print:text-sm print:mb-1 print:font-semibold">
                                            Jumlah Pajak
                                        </label>
                                        <p className="text-2xl font-bold text-blue-600 print:text-4xl print:text-blue-800 print:font-bold">
                                            {formatCurrency(record.amount)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 print:text-sm print:mb-1 print:font-semibold">
                                            Status Pembayaran
                                        </label>
                                        <span
                                            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                                record.status
                                            )} print:border-2 print:border-yellow-400 print:bg-yellow-100 print:text-yellow-800 print:px-1 print:py-0 print:text-sm print:font-semibold print:rounded-lg`}
                                        >
                                            {getStatusText(record.status)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Additional Info */}
                        <div className="space-y-6 print:space-y-2">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 print:text-2xl print:mb-2">
                                    Informasi Tambahan
                                </h3>
                                <div className="space-y-6 print:space-y-2">
                                    <div className="grid grid-cols-2 gap-4 print:gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 print:text-sm print:mb-1 print:font-semibold">
                                                Tanggal Jatuh Tempo
                                            </label>
                                            <p className="text-lg font-semibold text-gray-900 print:text-xl print:font-bold print:text-gray-800">
                                                {formatDate(record.due_date)}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 print:text-sm print:mb-1 print:font-semibold">
                                                Tanggal Pembayaran
                                            </label>
                                            <p className="text-lg font-semibold text-gray-900 print:text-xl print:font-bold print:text-gray-800">
                                                {formatDate(
                                                    record.payment_date
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 print:text-sm print:mb-1 print:font-semibold">
                                            Deskripsi
                                        </label>
                                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg print:bg-gray-100 print:border print:border-gray-300 print:p-0 print:text-sm print:text-gray-800 print:font-medium">
                                            {record.description ||
                                                "Tidak ada deskripsi"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 print:text-sm print:mb-1 print:font-semibold">
                                            Catatan
                                        </label>
                                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg print:bg-gray-100 print:border print:border-gray-300 print:p-0 print:text-sm print:text-gray-800 print:font-medium">
                                            {record.notes ||
                                                "Tidak ada catatan"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="mt-8 pt-6 border-t border-gray-200 print:mt-2 print:pt-1">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500 print:text-sm print:gap-2 print:text-gray-600">
                            <div>
                                <span className="font-medium">Dibuat:</span>{" "}
                                {formatDate(record.createdAt)}
                            </div>
                            <div>
                                <span className="font-medium">Diperbarui:</span>{" "}
                                {formatDate(record.updatedAt)}
                            </div>
                            <div>
                                <span className="font-medium">ID:</span>{" "}
                                {record._id}
                            </div>
                        </div>
                    </div>

                    {/* Print Footer */}
                    <div className="hidden print:block print:mt-2 print:pt-1 print:border-t print:border-gray-300">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="text-center">
                                <div className="border-t border-gray-300 pt-1 mt-1">
                                    <p className="text-sm text-gray-500 print:text-sm">
                                        Tanda Tangan
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1 print:text-sm">
                                        (_________________)
                                    </p>
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="border-t border-gray-300 pt-1 mt-1">
                                    <p className="text-sm text-gray-500 print:text-sm">
                                        Tanda Tangan
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1 print:text-sm">
                                        (_________________)
                                    </p>
                                </div>
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
        </Layout>
    )
}

export default DetailTaxRecord
