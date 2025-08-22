import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Layout, Toast } from "../../components/ui"
import { taxRecordService } from "../../services/taxRecordService"

const schema = yup
    .object({
        name: yup.string().required("Nama wajib diisi"),
        address: yup.string().required("Alamat wajib diisi"),
        tax_type: yup.string().required("Jenis pajak wajib diisi"),
        spt_number: yup.string().required("Nomor SPT wajib diisi"),
        year: yup.number().required("Tahun wajib diisi"),
        amount: yup.number().required("Jumlah wajib diisi"),
        description: yup.string(),
        status: yup.string().required("Status wajib diisi"),
        due_date: yup.date(),
        payment_date: yup.date(),
        notes: yup.string(),
    })
    .required()

const AddTaxRecord = () => {
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState(null)
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    })

    const showToast = (message, type = "info") => {
        setToast({ message, type })
    }

    const onSubmit = async (data) => {
        setLoading(true)

        try {
            // Ensure tax_type is PBB and year is 2025
            const submitData = {
                ...data,
                tax_type: "PBB",
                year: 2025,
            }

            const response = await taxRecordService.create(submitData)
            console.log("Create response:", response)

            if (response.success) {
                showToast("Data PBB berhasil ditambahkan!", "success")
                reset()
                setTimeout(() => {
                    navigate("/tax-records")
                }, 1500)
            } else {
                showToast(
                    response.message || "Gagal menambahkan data PBB",
                    "error"
                )
            }
        } catch (error) {
            console.error("Error creating tax record:", error)
            if (error.response?.data?.message) {
                showToast(`Error: ${error.response.data.message}`, "error")
            } else {
                showToast(
                    "Terjadi kesalahan saat menambahkan data PBB",
                    "error"
                )
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
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Basic Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Informasi Wajib Pajak
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        {...register("name")}
                                        type="text"
                                        placeholder="Masukkan nama lengkap"
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.name
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Alamat
                                    </label>
                                    <textarea
                                        {...register("address")}
                                        placeholder="Masukkan alamat lengkap"
                                        rows="3"
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.address
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {errors.address && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.address.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Jenis Pajak
                                    </label>
                                    <input
                                        {...register("tax_type")}
                                        type="text"
                                        value="PBB"
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Pajak Bumi dan Bangunan
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nomor SPPT
                                    </label>
                                    <input
                                        {...register("spt_number")}
                                        type="text"
                                        placeholder="Contoh: SPPT-2024-001"
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.spt_number
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {errors.spt_number && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.spt_number.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tahun
                                    </label>
                                    <input
                                        {...register("year")}
                                        type="text"
                                        value="2025"
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Tahun Pajak 2025
                                    </p>
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
                                        {...register("amount")}
                                        type="text"
                                        placeholder="0"
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.amount
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {errors.amount && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.amount.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status Pembayaran
                                    </label>
                                    <select
                                        {...register("status")}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="belum_lunas">
                                            Belum Lunas
                                        </option>
                                        <option value="proses">Proses</option>
                                        <option value="lunas">Lunas</option>
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.status.message}
                                        </p>
                                    )}
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
                                        {...register("due_date")}
                                        type="date"
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.due_date
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {errors.due_date && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.due_date.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tanggal Pembayaran
                                    </label>
                                    <input
                                        {...register("payment_date")}
                                        type="date"
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
                                        {...register("description")}
                                        type="text"
                                        placeholder="Deskripsi singkat tentang pajak ini"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Catatan
                                    </label>
                                    <textarea
                                        {...register("notes")}
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
                                    <>
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
                                        <span>Simpan Data</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
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

export default AddTaxRecord
