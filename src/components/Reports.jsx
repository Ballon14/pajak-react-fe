import React, { useState, useEffect } from "react"
import Layout from "./Layout"

const Reports = () => {
    const [loading, setLoading] = useState(true)
    const [selectedReport, setSelectedReport] = useState("summary")
    const [dateRange, setDateRange] = useState("this_year")
    const [reportData, setReportData] = useState(null)

    useEffect(() => {
        // Simulate loading data
        setTimeout(() => {
            setLoading(false)
            // Mock data
            setReportData({
                summary: {
                    totalTax: 15000000,
                    paidTax: 12000000,
                    unpaidTax: 3000000,
                    totalRecords: 12,
                    paidRecords: 10,
                    unpaidRecords: 2,
                },
                monthlyData: [
                    { month: "Jan", amount: 1200000, paid: 1000000 },
                    { month: "Feb", amount: 1500000, paid: 1200000 },
                    { month: "Mar", amount: 1800000, paid: 1500000 },
                    { month: "Apr", amount: 1400000, paid: 1200000 },
                    { month: "Mei", amount: 1600000, paid: 1400000 },
                    { month: "Jun", amount: 1900000, paid: 1600000 },
                    { month: "Jul", amount: 1700000, paid: 1500000 },
                    { month: "Ags", amount: 2000000, paid: 1800000 },
                    { month: "Sep", amount: 1800000, paid: 1600000 },
                    { month: "Okt", amount: 2200000, paid: 2000000 },
                    { month: "Nov", amount: 2500000, paid: 2300000 },
                    { month: "Des", amount: 2800000, paid: 2500000 },
                ],
                propertyData: [
                    {
                        property: "Rumah Tinggal",
                        amount: 8000000,
                        percentage: 53.3,
                    },
                    { property: "Kantor", amount: 4500000, percentage: 30.0 },
                    { property: "Gudang", amount: 1500000, percentage: 10.0 },
                    {
                        property: "Lahan Kosong",
                        amount: 1000000,
                        percentage: 6.7,
                    },
                ],
            })
        }, 1500)
    }, [])

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const handleExport = (format) => {
        alert(`Laporan akan diekspor dalam format ${format.toUpperCase()}`)
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

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Laporan PBB
                        </h1>
                        <p className="text-gray-600">
                            Generate dan ekspor laporan Pajak Bumi dan Bangunan
                            (PBB)
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="this_month">Bulan Ini</option>
                            <option value="last_month">Bulan Lalu</option>
                            <option value="this_quarter">Kuartal Ini</option>
                            <option value="this_year">Tahun Ini</option>
                            <option value="last_year">Tahun Lalu</option>
                        </select>
                        <button
                            onClick={() => handleExport("pdf")}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
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
                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <span>Export PDF</span>
                        </button>
                        <button
                            onClick={() => handleExport("excel")}
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
                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <span>Export Excel</span>
                        </button>
                    </div>
                </div>

                {/* Report Type Selector */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setSelectedReport("summary")}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                selectedReport === "summary"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            Ringkasan
                        </button>
                        <button
                            onClick={() => setSelectedReport("monthly")}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                selectedReport === "monthly"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            Bulanan
                        </button>
                        <button
                            onClick={() => setSelectedReport("tax_type")}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                selectedReport === "tax_type"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            Jenis Properti
                        </button>
                    </div>
                </div>

                {/* Report Content */}
                {selectedReport === "summary" && (
                    <div className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <svg
                                            className="w-6 h-6 text-blue-600"
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
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">
                                            Total PBB
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatCurrency(
                                                reportData.summary.totalTax
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <svg
                                            className="w-6 h-6 text-green-600"
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
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">
                                            Sudah Dibayar
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatCurrency(
                                                reportData.summary.paidTax
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                        <svg
                                            className="w-6 h-6 text-red-600"
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
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">
                                            Belum Dibayar
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatCurrency(
                                                reportData.summary.unpaidTax
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <svg
                                            className="w-6 h-6 text-purple-600"
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
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">
                                            Total Properti
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {reportData.summary.totalRecords}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Progress Chart */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Progress Pembayaran
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm text-gray-600 mb-2">
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
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-blue-600 to-green-600 h-3 rounded-full transition-all duration-500"
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
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="text-center p-3 bg-green-50 rounded-lg">
                                        <p className="font-semibold text-green-800">
                                            {reportData.summary.paidRecords}
                                        </p>
                                        <p className="text-green-600">
                                            Sudah Lunas
                                        </p>
                                    </div>
                                    <div className="text-center p-3 bg-red-50 rounded-lg">
                                        <p className="font-semibold text-red-800">
                                            {reportData.summary.unpaidRecords}
                                        </p>
                                        <p className="text-red-600">
                                            Belum Lunas
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {selectedReport === "monthly" && (
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">
                            Laporan PBB Bulanan
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Bulan
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total PBB
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Sudah Dibayar
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Belum Dibayar
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Progress
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reportData.monthlyData.map(
                                        (item, index) => {
                                            const unpaid =
                                                item.amount - item.paid
                                            const progress =
                                                (item.paid / item.amount) * 100
                                            return (
                                                <tr
                                                    key={index}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {item.month}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatCurrency(
                                                            item.amount
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                                                        {formatCurrency(
                                                            item.paid
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                                                        {formatCurrency(unpaid)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                                                <div
                                                                    className="bg-green-600 h-2 rounded-full"
                                                                    style={{
                                                                        width: `${progress}%`,
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-xs text-gray-500">
                                                                {Math.round(
                                                                    progress
                                                                )}
                                                                %
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {selectedReport === "tax_type" && (
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">
                            Laporan Berdasarkan Jenis Properti
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <div className="space-y-4">
                                    {reportData.propertyData.map(
                                        (item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                            >
                                                <div className="flex items-center">
                                                    <div
                                                        className={`w-4 h-4 rounded-full mr-3 ${
                                                            index === 0
                                                                ? "bg-blue-500"
                                                                : index === 1
                                                                ? "bg-green-500"
                                                                : index === 2
                                                                ? "bg-yellow-500"
                                                                : "bg-purple-500"
                                                        }`}
                                                    ></div>
                                                    <span className="font-medium text-gray-900">
                                                        {item.property}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-900">
                                                        {formatCurrency(
                                                            item.amount
                                                        )}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {item.percentage}%
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="w-64 h-64 relative">
                                    {/* Simple pie chart representation */}
                                    <div className="w-full h-full rounded-full border-8 border-gray-200 relative overflow-hidden">
                                        <div
                                            className="absolute inset-0 bg-blue-500"
                                            style={{
                                                clipPath:
                                                    "polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%)",
                                            }}
                                        ></div>
                                        <div
                                            className="absolute inset-0 bg-green-500"
                                            style={{
                                                clipPath:
                                                    "polygon(50% 50%, 50% 0%, 83.3% 0%, 83.3% 100%, 50% 100%)",
                                            }}
                                        ></div>
                                        <div
                                            className="absolute inset-0 bg-yellow-500"
                                            style={{
                                                clipPath:
                                                    "polygon(50% 50%, 50% 0%, 93.3% 0%, 93.3% 100%, 50% 100%)",
                                            }}
                                        ></div>
                                        <div
                                            className="absolute inset-0 bg-purple-500"
                                            style={{
                                                clipPath:
                                                    "polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%)",
                                            }}
                                        ></div>
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
                    </div>
                )}
            </div>
        </Layout>
    )
}

export default Reports
