import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Layout, Toast, ConfirmModal } from "../../components/ui"
import { taxRecordService } from "../../services/taxRecordService"

const TaxRecords = () => {
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState(null)
    const navigate = useNavigate()

    const [filters, setFilters] = useState({
        status: "",
        property_type: "",
        year: "",
        showOutstanding: false,
    })

    // Confirm modals
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [confirmMessage, setConfirmMessage] = useState("")
    const [confirmAction, setConfirmAction] = useState(() => () => {})

    useEffect(() => {
        loadTaxRecords()
    }, [])

    const showToast = (message, type = "info") => {
        setToast({ message, type })
    }

    const loadTaxRecords = async () => {
        try {
            setLoading(true)

            let response
            if (filters.showOutstanding) {
                response = await taxRecordService.getOutstanding()
            } else {
                response = await taxRecordService.getAll()
            }

            if (response.success) {
                setRecords(response.data || [])
            } else {
                showToast(response.message || "Gagal memuat data PBB", "error")
            }
        } catch (error) {
            console.error("Error loading tax records:", error)
            showToast("Gagal memuat data PBB", "error")
        } finally {
            setLoading(false)
        }
    }

    const handleFilter = () => {
        loadTaxRecords()
    }

    const handleEdit = (recordId) => {
        navigate(`/tax-records/${recordId}/edit`)
    }

    const askDelete = (recordId) => {
        setConfirmMessage("Apakah Anda yakin ingin menghapus data PBB ini?")
        setConfirmAction(() => async () => {
            try {
                const response = await taxRecordService.delete(recordId)
                if (response.success) {
                    showToast("Data PBB berhasil dihapus", "success")
                    loadTaxRecords()
                } else {
                    showToast(
                        response.message || "Gagal menghapus data PBB",
                        "error"
                    )
                }
            } catch (error) {
                console.error("Error deleting tax record:", error)
                showToast("Gagal menghapus data PBB", "error")
            } finally {
                setConfirmOpen(false)
            }
        })
        setConfirmOpen(true)
    }

    const handleView = (recordId) => {
        navigate(`/tax-records/${recordId}`)
    }

    const askCreateNewYear = () => {
        const currentYear = new Date().getFullYear()
        setConfirmMessage(
            `Apakah Anda yakin ingin membuat data PBB untuk tahun baru?\nData akan dibuat berdasarkan data tahun sebelumnya dengan kenaikan 10%. (Tahun: ${currentYear})`
        )
        setConfirmAction(() => async () => {
            try {
                setLoading(true)
                const response = await taxRecordService.createForYear(
                    currentYear
                )
                if (response.success) {
                    let message = `Berhasil membuat ${response.count} data PBB untuk tahun ${currentYear}`
                    if (response.outstandingCount > 0) {
                        message += ` (${response.outstandingCount} tunggakan, ${response.newYearCount} data baru)`
                    }
                    showToast(message, "success")
                    loadTaxRecords()
                } else {
                    showToast(
                        response.message || "Gagal membuat data tahun baru",
                        "error"
                    )
                }
            } catch (error) {
                console.error("Error creating new year data:", error)
                showToast("Gagal membuat data tahun baru", "error")
            } finally {
                setLoading(false)
                setConfirmOpen(false)
            }
        })
        setConfirmOpen(true)
    }

    return (
        <Layout>
            <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                            Data Pajak Bumi dan Bangunan
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600">
                            Kelola semua data PBB Anda
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                        <button
                            onClick={askCreateNewYear}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                            <svg
                                className="w-4 h-4 sm:w-5 sm:h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            <span className="hidden sm:inline">Tahun Baru</span>
                            <span className="sm:hidden">Tahun Baru</span>
                        </button>
                        <button
                            onClick={() => navigate("/tax-records/create")}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                            <svg
                                className="w-4 h-4 sm:w-5 sm:h-5"
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
                            <span className="hidden sm:inline">
                                Tambah Data
                            </span>
                            <span className="sm:hidden">Tambah</span>
                        </button>
                    </div>
                </div>

                {/* Print Header */}
                <div className="hidden print:block print:mb-6">
                    <div className="text-center border-b-2 border-gray-300 pb-4">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 print:text-4xl">
                            DAFTAR DATA PBB
                        </h1>
                        <p className="text-lg text-gray-600 print:text-xl">
                            Pajak Bumi dan Bangunan
                        </p>
                        <p className="text-sm text-gray-500 mt-2 print:text-base">
                            Tanggal Cetak:{" "}
                            {new Date().toLocaleDateString("id-ID")}
                        </p>
                    </div>
                </div>

                {/* Filter and Search */}
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 print:hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                Filter Status
                            </label>
                            <select
                                value={filters.status}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        status: e.target.value,
                                    })
                                }
                                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                            >
                                <option value="">Semua Status</option>
                                <option value="lunas">Lunas</option>
                                <option value="belum_lunas">Belum Lunas</option>
                                <option value="proses">Proses</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                Jenis Properti
                            </label>
                            <select
                                value={filters.property_type}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        property_type: e.target.value,
                                    })
                                }
                                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                            >
                                <option value="">Semua Jenis</option>
                                <option value="rumah_tinggal">
                                    Rumah Tinggal
                                </option>
                                <option value="kantor">Kantor</option>
                                <option value="gudang">Gudang</option>
                                <option value="lahan_kosong">
                                    Lahan Kosong
                                </option>
                                <option value="toko">Toko/Ruko</option>
                                <option value="pabrik">Pabrik</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                Tahun
                            </label>
                            <select
                                value={filters.year}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        year: e.target.value,
                                    })
                                }
                                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                            >
                                <option value="">Semua Tahun</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                Tampilkan
                            </label>
                            <select
                                value={
                                    filters.showOutstanding
                                        ? "outstanding"
                                        : "all"
                                }
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        showOutstanding:
                                            e.target.value === "outstanding",
                                    })
                                }
                                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                            >
                                <option value="all">Semua Data</option>
                                <option value="outstanding">
                                    Tunggakan Saja
                                </option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={handleFilter}
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors duration-200 text-xs sm:text-sm"
                            >
                                Filter
                            </button>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-gray-600">
                                Memuat data...
                            </span>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && records.length === 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
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
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Tidak ada data PBB
                            </h3>
                            <p className="text-gray-500 mb-4">
                                Mulai dengan menambahkan data PBB pertama Anda
                            </p>
                            <button
                                onClick={() => navigate("/tax-records/create")}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                            >
                                Tambah Data PBB
                            </button>
                        </div>
                    </div>
                )}

                {/* Desktop Table View */}
                {!loading && records.length > 0 && (
                    <div className="hidden lg:block bg-white rounded-xl shadow-lg border border-gray-100 print:shadow-none print:border-none print:p-0">
                        <div className="overflow-x-auto print:overflow-visible">
                            <table className="min-w-full divide-y divide-gray-200 print:divide-gray-300">
                                <thead className="bg-gray-50 print:bg-gray-100">
                                    <tr>
                                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-sm print:px-4 print:py-2">
                                            Nama
                                        </th>
                                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-sm print:px-4 print:py-2">
                                            Alamat
                                        </th>
                                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-sm print:px-4 print:py-2">
                                            Jenis Pajak
                                        </th>
                                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-sm print:px-4 print:py-2">
                                            Nomor SPT
                                        </th>
                                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-sm print:px-4 print:py-2">
                                            Tahun
                                        </th>
                                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-sm print:px-4 print:py-2">
                                            Jumlah
                                        </th>
                                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-sm print:px-4 print:py-2">
                                            Status
                                        </th>
                                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:hidden">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 print:divide-gray-300">
                                    {records.map((record) => (
                                        <tr
                                            key={record._id}
                                            className="hover:bg-gray-50 print:hover:bg-white"
                                        >
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 print:text-base print:px-4 print:py-2">
                                                {record.name || "-"}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 print:text-base print:px-4 print:py-2">
                                                {record.address || "-"}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 print:text-base print:px-4 print:py-2">
                                                {record.tax_type}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 print:text-base print:px-4 print:py-2">
                                                {record.spt_number}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 print:text-base print:px-4 print:py-2">
                                                {record.year}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 print:text-base print:px-4 print:py-2">
                                                {new Intl.NumberFormat(
                                                    "id-ID",
                                                    {
                                                        style: "currency",
                                                        currency: "IDR",
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 0,
                                                    }
                                                ).format(record.amount)}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap print:px-4 print:py-2">
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        record.status ===
                                                        "lunas"
                                                            ? "bg-green-100 text-green-800"
                                                            : record.status ===
                                                              "proses"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                    } print:border print:border-gray-300 print:bg-white print:text-black print:text-sm print:px-3 print:py-1`}
                                                >
                                                    {record.status === "lunas"
                                                        ? "Lunas"
                                                        : record.status ===
                                                          "proses"
                                                        ? "Proses"
                                                        : "Belum Lunas"}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium print:hidden">
                                                <div className="flex items-center space-x-2">
                                                    {/* View/Detail Button */}
                                                    <button
                                                        onClick={() =>
                                                            handleView(
                                                                record._id
                                                            )
                                                        }
                                                        className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-colors duration-200"
                                                        title="Lihat Detail"
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

                                                    {/* Edit Button */}
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(
                                                                record._id
                                                            )
                                                        }
                                                        className="text-yellow-600 hover:text-yellow-900 p-1 rounded-md hover:bg-yellow-50 transition-colors duration-200"
                                                        title="Edit Data"
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

                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() =>
                                                            askDelete(
                                                                record._id
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors duration-200"
                                                        title="Hapus Data"
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
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Mobile Card View */}
                {!loading && records.length > 0 && (
                    <div className="lg:hidden space-y-3">
                        {records.map((record) => (
                            <div
                                key={record._id}
                                className="bg-white rounded-xl shadow-lg p-4 border border-gray-100"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                                            {record.name || "-"}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                            {record.address || "-"}
                                        </p>
                                    </div>
                                    <span
                                        className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${
                                            record.status === "lunas"
                                                ? "bg-green-100 text-green-800"
                                                : record.status === "proses"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {record.status === "lunas"
                                            ? "Lunas"
                                            : record.status === "proses"
                                            ? "Proses"
                                            : "Belum Lunas"}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-3 text-xs sm:text-sm">
                                    <div>
                                        <span className="text-gray-500">
                                            Jenis:
                                        </span>
                                        <p className="font-medium text-gray-900">
                                            {record.tax_type}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">
                                            SPT:
                                        </span>
                                        <p className="font-medium text-gray-900">
                                            {record.spt_number}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">
                                            Tahun:
                                        </span>
                                        <p className="font-medium text-gray-900">
                                            {record.year}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">
                                            Jumlah:
                                        </span>
                                        <p className="font-medium text-gray-900">
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0,
                                            }).format(record.amount)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-1 pt-2 border-t border-gray-200">
                                    <button
                                        onClick={() => handleView(record._id)}
                                        className="p-1.5 sm:p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Lihat Detail"
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
                                        onClick={() => handleEdit(record._id)}
                                        className="p-1.5 sm:p-2 text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 rounded-lg transition-colors"
                                        title="Edit Data"
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
                                        onClick={() => askDelete(record._id)}
                                        className="p-1.5 sm:p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Hapus Data"
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
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {confirmOpen && (
                <ConfirmModal
                    isOpen={confirmOpen}
                    title="Konfirmasi"
                    message={confirmMessage}
                    confirmText="Lanjut"
                    cancelText="Batal"
                    onConfirm={confirmAction}
                    onCancel={() => setConfirmOpen(false)}
                />
            )}
        </Layout>
    )
}

export default TaxRecords
