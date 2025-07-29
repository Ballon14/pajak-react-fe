import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "./Layout"
import { taxRecordService } from "../services/taxRecordService"

const AddTaxRecord = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        taxType: "",
        sptNumber: "",
        period: "",
        year: new Date().getFullYear(),
        amount: "",
        description: "",
        status: "belum_lunas",
        dueDate: "",
        paymentDate: "",
        notes: "",
    })

    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.taxType) {
            newErrors.taxType = "Jenis pajak harus dipilih"
        }

        if (!formData.sptNumber) {
            newErrors.sptNumber = "Nomor SPT harus diisi"
        }

        if (!formData.period) {
            newErrors.period = "Periode harus diisi"
        }

        if (!formData.amount) {
            newErrors.amount = "Jumlah pajak harus diisi"
        } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
            newErrors.amount = "Jumlah pajak harus berupa angka positif"
        }

        if (!formData.dueDate) {
            newErrors.dueDate = "Tanggal jatuh tempo harus diisi"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setLoading(true)

        try {
            // Prepare data for API
            const taxData = {
                tax_type: formData.taxType,
                spt_number: formData.sptNumber,
                period: formData.period,
                year: formData.year,
                amount: parseFloat(formData.amount),
                description: formData.description,
                status: formData.status,
                due_date: formData.dueDate,
                payment_date: formData.paymentDate || null,
                notes: formData.notes,
            }

            // Call API
            await taxRecordService.create(taxData)

            // Success
            alert("Data PBB berhasil ditambahkan!")
            navigate("/tax-records")
        } catch (error) {
            console.error("Error creating tax record:", error)
            if (error.response?.data?.message) {
                alert(`Error: ${error.response.data.message}`)
            } else {
                alert("Terjadi kesalahan saat menambahkan data PBB")
            }
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        navigate("/tax-records")
    }

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Tambah Data PBB
                        </h1>
                        <p className="text-gray-600">
                            Isi form di bawah untuk menambahkan data Pajak Bumi
                            dan Bangunan (PBB) baru
                        </p>
                    </div>
                    <button
                        onClick={handleCancel}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                        Batal
                    </button>
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Informasi Dasar
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Jenis Properti{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="taxType"
                                        value={formData.taxType}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.taxType
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    >
                                        <option value="">
                                            Pilih Jenis Properti
                                        </option>
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
                                    {errors.taxType && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.taxType}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nomor SPPT{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="sptNumber"
                                        value={formData.sptNumber}
                                        onChange={handleChange}
                                        placeholder="Contoh: SPPT-2024-001"
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.sptNumber
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {errors.sptNumber && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.sptNumber}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Periode{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="period"
                                        value={formData.period}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.period
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    >
                                        <option value="">Pilih Periode</option>
                                        <option value="januari">Januari</option>
                                        <option value="februari">
                                            Februari
                                        </option>
                                        <option value="maret">Maret</option>
                                        <option value="april">April</option>
                                        <option value="mei">Mei</option>
                                        <option value="juni">Juni</option>
                                        <option value="juli">Juli</option>
                                        <option value="agustus">Agustus</option>
                                        <option value="september">
                                            September
                                        </option>
                                        <option value="oktober">Oktober</option>
                                        <option value="november">
                                            November
                                        </option>
                                        <option value="desember">
                                            Desember
                                        </option>
                                    </select>
                                    {errors.period && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.period}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tahun
                                    </label>
                                    <select
                                        name="year"
                                        value={formData.year}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {Array.from(
                                            { length: 10 },
                                            (_, i) =>
                                                new Date().getFullYear() - i
                                        ).map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Amount and Status */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Jumlah dan Status
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Jumlah PBB (Rp){" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        placeholder="0"
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.amount
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {errors.amount && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.amount}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status Pembayaran
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="belum_lunas">
                                            Belum Lunas
                                        </option>
                                        <option value="proses">Proses</option>
                                        <option value="lunas">Lunas</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Dates */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Tanggal
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tanggal Jatuh Tempo{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="dueDate"
                                        value={formData.dueDate}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.dueDate
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {errors.dueDate && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.dueDate}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tanggal Pembayaran
                                    </label>
                                    <input
                                        type="date"
                                        name="paymentDate"
                                        value={formData.paymentDate}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description and Notes */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Keterangan
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Deskripsi
                                    </label>
                                    <input
                                        type="text"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Deskripsi singkat tentang pajak ini"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Catatan
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Catatan tambahan (opsional)"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Menyimpan...</span>
                                    </>
                                ) : (
                                    <span>Simpan Data</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default AddTaxRecord
