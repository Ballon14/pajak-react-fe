import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "./Layout"
import { taxRecordService } from "../services/taxRecordService"

const TaxRecords = () => {
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const [filters, setFilters] = useState({
        status: "",
        property_type: "",
        year: "",
    })

    useEffect(() => {
        loadTaxRecords()
    }, [])

    const loadTaxRecords = async () => {
        try {
            setLoading(true)
            const response = await taxRecordService.getAll()
            if (response.success) {
                setRecords(response.data || [])
            } else {
                alert(response.message || "Gagal memuat data PBB")
            }
        } catch (error) {
            console.error("Error loading tax records:", error)
            alert("Gagal memuat data PBB")
        } finally {
            setLoading(false)
        }
    }

    const handleFilter = () => {
        loadTaxRecords()
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

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Data PBB
                        </h1>
                        <p className="text-gray-600">
                            Kelola semua data Pajak Bumi dan Bangunan (PBB) Anda
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/tax-records/create")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
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
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                        <span>Tambah Data</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={filters.status}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        status: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Semua Status</option>
                                <option value="lunas">Lunas</option>
                                <option value="belum_lunas">Belum Lunas</option>
                                <option value="proses">Proses</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Semua Tahun</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={handleFilter}
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                            >
                                Filter
                            </button>
                        </div>
                    </div>
                </div>

                {/* Records Table */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Daftar Data PBB
                        </h2>
                    </div>

                    {records.length === 0 ? (
                        <div className="text-center py-12">
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
                                Belum ada data PBB
                            </p>
                            <p className="text-gray-400">
                                Mulai dengan menambahkan data PBB pertama Anda
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            No
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Jenis Properti
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nomor SPPT
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Periode
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Jumlah
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {records.map((record, index) => (
                                        <tr key={record._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {record.tax_type}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {record.spt_number}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {record.period} {record.year}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/tax-records/${record._id}`
                                                        )
                                                    }
                                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                                >
                                                    Detail
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    )
}

export default TaxRecords
