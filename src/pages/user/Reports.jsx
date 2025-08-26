import React, { useState, useEffect } from "react"
import { Layout, Toast } from "../../components/ui"
import { reportService } from "../../services/reportService"

const Reports = () => {
    const [loading, setLoading] = useState(true)
    const [selectedReport, setSelectedReport] = useState("summary")
    const [dateRange, setDateRange] = useState("this_year")
    const [reportData, setReportData] = useState(null)
    const [toast, setToast] = useState(null)

    const showToast = (message, type = "info") => {
        setToast({ message, type })
    }

    const loadReportData = async (forceReload = false) => {
        try {
            setLoading(true)

            // Check if data already exists for this report type (unless force reload)
            if (
                !forceReload &&
                selectedReport === "summary" &&
                reportData?.summary
            ) {
                setLoading(false)
                return
            }

            if (
                !forceReload &&
                selectedReport === "tax_type" &&
                reportData?.propertyData
            ) {
                setLoading(false)
                return
            }

            if (selectedReport === "summary") {
                const response = await reportService.getSummary(dateRange)
                if (response.success) {
                    setReportData((prevData) => ({
                        ...prevData,
                        summary: response.data,
                    }))
                } else {
                    showToast(
                        response.message || "Gagal memuat data ringkasan",
                        "error"
                    )
                }
            } else if (selectedReport === "tax_type") {
                const response = await reportService.getProperty(dateRange)
                if (response.success) {
                    setReportData((prevData) => ({
                        ...prevData,
                        propertyData: response.data,
                    }))
                } else {
                    showToast(
                        response.message || "Gagal memuat data properti",
                        "error"
                    )
                }
            }
        } catch (error) {
            console.error("❌ Error loading report data:", error)
            showToast("Terjadi kesalahan saat memuat data laporan", "error")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadReportData()
    }, [selectedReport])

    useEffect(() => {
        loadReportData(true) // Force reload when dateRange changes
    }, [dateRange])

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const handleExport = async (format) => {
        setLoading(true)

        // Simulate export process
        setTimeout(() => {
            showToast(
                `Laporan akan diekspor dalam format ${format.toUpperCase()}`,
                "success"
            )
            setLoading(false)
        }, 2000)
    }

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading laporan...</p>
                    </div>
                </div>
            </Layout>
        )
    }

    if (!reportData) {
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
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                        </svg>
                        <p className="text-gray-500 text-lg mb-2">
                            Tidak ada data laporan
                        </p>
                        <p className="text-gray-400">
                            Belum ada data yang tersedia untuk ditampilkan
                        </p>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                            Laporan Pajak
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600">
                            Generate dan ekspor laporan pajak dalam berbagai
                            format
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => window.print()}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
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
                                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                />
                            </svg>
                            <span className="hidden sm:inline">Print</span>
                            <span className="sm:hidden">Print</span>
                        </button>
                        <button
                            onClick={() => handleExport("pdf")}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
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
                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <span className="hidden sm:inline">Export PDF</span>
                            <span className="sm:hidden">PDF</span>
                        </button>
                        <button
                            onClick={() => handleExport("excel")}
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
                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <span className="hidden sm:inline">
                                Export Excel
                            </span>
                            <span className="sm:hidden">Excel</span>
                        </button>
                    </div>
                </div>

                {/* Date Range Selector */}
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                Periode Laporan
                            </label>
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="this_month">Bulan Ini</option>
                                <option value="last_month">Bulan Lalu</option>
                                <option value="this_quarter">
                                    Kuartal Ini
                                </option>
                                <option value="this_year">Tahun Ini</option>
                                <option value="last_year">Tahun Lalu</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Report Type Selector */}
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                        <button
                            onClick={() => setSelectedReport("summary")}
                            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base ${
                                selectedReport === "summary"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            Ringkasan
                        </button>
                        <button
                            onClick={() => setSelectedReport("tax_type")}
                            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base ${
                                selectedReport === "tax_type"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            Jenis Properti
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-gray-600">
                                Memuat laporan...
                            </span>
                        </div>
                    </div>
                )}

                {/* Report Content */}
                {!loading && reportData && selectedReport === "summary" && (
                    <div className="space-y-4 sm:space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg
                                            className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
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
                                    <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                                        <p className="text-xs sm:text-sm font-medium text-gray-500">
                                            Total Pajak
                                        </p>
                                        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                                            {formatCurrency(
                                                reportData.summary.totalTax
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg
                                            className="w-5 h-5 sm:w-6 sm:h-6 text-green-600"
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
                                    <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                                        <p className="text-xs sm:text-sm font-medium text-gray-500">
                                            Pajak Terbayar
                                        </p>
                                        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                                            {formatCurrency(
                                                reportData.summary.paidTax
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg
                                            className="w-5 h-5 sm:w-6 sm:h-6 text-red-600"
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
                                    <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                                        <p className="text-xs sm:text-sm font-medium text-gray-500">
                                            Belum Bayar
                                        </p>
                                        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                                            {formatCurrency(
                                                reportData.summary.unpaidTax
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg
                                            className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                                        <p className="text-xs sm:text-sm font-medium text-gray-500">
                                            Total Catatan
                                        </p>
                                        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                                            {reportData.summary.totalRecords}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Progress Chart */}
                        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                                Progress Pembayaran
                            </h3>
                            <div className="space-y-3 sm:space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
                                        <span>Progress Pembayaran</span>
                                        <span>
                                            {Math.round(
                                                (reportData.summary.paidTax /
                                                    reportData.summary
                                                        .totalTax) *
                                                    100
                                            )}
                                            %
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                                        <div
                                            className="bg-gradient-to-r from-blue-600 to-green-600 h-2 sm:h-3 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${
                                                    (reportData.summary
                                                        .paidTax /
                                                        reportData.summary
                                                            .totalTax) *
                                                    100
                                                }%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Property Type Report */}
                {!loading && reportData && selectedReport === "tax_type" && (
                    <div className="space-y-4 sm:space-y-6">
                        {/* Property Distribution */}
                        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                                Distribusi Berdasarkan Jenis
                            </h3>
                            {reportData.propertyData &&
                            reportData.propertyData.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="space-y-2 sm:space-y-3">
                                        {reportData.propertyData.map(
                                            (item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg"
                                                >
                                                    <div className="flex items-center">
                                                        <div
                                                            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-2 sm:mr-3 ${
                                                                [
                                                                    "bg-blue-500",
                                                                    "bg-green-500",
                                                                    "bg-yellow-500",
                                                                    "bg-purple-500",
                                                                ][idx % 4]
                                                            }`}
                                                        ></div>
                                                        <span className="font-medium text-gray-900 text-xs sm:text-sm md:text-base">
                                                            {item.property}
                                                        </span>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base">
                                                            {formatCurrency(
                                                                item.amount
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {item.percentage}%
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <div className="w-32 h-32 sm:w-48 sm:h-48 relative">
                                            <div className="w-full h-full rounded-full border-4 sm:border-8 border-gray-200 relative overflow-hidden">
                                                {reportData.propertyData.map(
                                                    (item, index) => {
                                                        const colors = [
                                                            "bg-blue-500",
                                                            "bg-green-500",
                                                            "bg-yellow-500",
                                                            "bg-purple-500",
                                                        ]
                                                        const color =
                                                            colors[
                                                                index %
                                                                    colors.length
                                                            ]
                                                        const percentage =
                                                            item.percentage
                                                        const startAngle =
                                                            index === 0
                                                                ? 0
                                                                : reportData.propertyData
                                                                      .slice(
                                                                          0,
                                                                          index
                                                                      )
                                                                      .reduce(
                                                                          (
                                                                              s,
                                                                              it
                                                                          ) =>
                                                                              s +
                                                                              it.percentage,
                                                                          0
                                                                      ) * 3.6

                                                        const clip = `polygon(50% 50%, 50% 0%, ${
                                                            50 +
                                                            Math.cos(
                                                                ((startAngle +
                                                                    percentage *
                                                                        3.6) *
                                                                    Math.PI) /
                                                                    180
                                                            ) *
                                                                50
                                                        }% ${
                                                            50 +
                                                            Math.sin(
                                                                ((startAngle +
                                                                    percentage *
                                                                        3.6) *
                                                                    Math.PI) /
                                                                    180
                                                            ) *
                                                                50
                                                        }%, ${
                                                            50 +
                                                            Math.cos(
                                                                (startAngle *
                                                                    Math.PI) /
                                                                    180
                                                            ) *
                                                                50
                                                        }% ${
                                                            50 +
                                                            Math.sin(
                                                                (startAngle *
                                                                    Math.PI) /
                                                                    180
                                                            ) *
                                                                50
                                                        }%)`

                                                        return (
                                                            <div
                                                                key={index}
                                                                className={`absolute inset-0 ${color}`}
                                                                style={{
                                                                    clipPath:
                                                                        clip,
                                                                }}
                                                            />
                                                        )
                                                    }
                                                )}
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center">
                                                    <span className="text-xs sm:text-sm font-semibold text-gray-700">
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
        </Layout>
    )
}

export default Reports
