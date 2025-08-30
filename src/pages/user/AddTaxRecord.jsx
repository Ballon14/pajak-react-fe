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
        year: yup
            .number()
            .transform((value) => (isNaN(value) ? undefined : value))
            .required("Tahun wajib diisi"),
        amount: yup
            .number()
            .transform((value) => (isNaN(value) ? undefined : value))
            .required("Jumlah wajib diisi"),
        description: yup.string(),
        status: yup.string().required("Status wajib diisi"),
        due_date: yup
            .string()
            .nullable()
            .transform((value) => {
                if (!value) return null
                // If it's already in YYYY-MM-DD format, return as is
                if (
                    typeof value === "string" &&
                    value.match(/^\d{4}-\d{2}-\d{2}$/)
                ) {
                    return value
                }
                // Try to parse and format
                try {
                    const date = new Date(value)
                    if (isNaN(date.getTime())) return null
                    return date.toISOString().split("T")[0]
                } catch {
                    return null
                }
            }),
        payment_date: yup
            .string()
            .nullable()
            .transform((value) => {
                if (!value) return null
                // If it's already in YYYY-MM-DD format, return as is
                if (
                    typeof value === "string" &&
                    value.match(/^\d{4}-\d{2}-\d{2}$/)
                ) {
                    return value
                }
                // Try to parse and format
                try {
                    const date = new Date(value)
                    if (isNaN(date.getTime())) return null
                    return date.toISOString().split("T")[0]
                } catch {
                    return null
                }
            }),
        notes: yup.string(),
    })
    .required()

const AddTaxRecord = () => {
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
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

    const handleFileChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            setSelectedFile(file)
            const reader = new FileReader()
            reader.onload = () => {
                setPreviewUrl(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeFile = () => {
        setSelectedFile(null)
        setPreviewUrl(null)
    }

    const onSubmit = async (data) => {
        setLoading(true)

        try {
            // Helper function to format date safely
            const formatDate = (dateString) => {
                if (!dateString) return null
                // If it's already in YYYY-MM-DD format, return as is
                if (
                    typeof dateString === "string" &&
                    dateString.match(/^\d{4}-\d{2}-\d{2}$/)
                ) {
                    return dateString
                }
                // Otherwise, parse and format
                const date = new Date(dateString)
                if (isNaN(date.getTime())) return null
                return date.toISOString().split("T")[0]
            }

            // Ensure tax_type is PBB and year is 2025
            const submitData = {
                ...data,
                tax_type: "PBB",
                year: 2025,
                amount: parseFloat(data.amount) || 0,
                due_date: formatDate(data.due_date),
                payment_date: formatDate(data.payment_date),
            }

            const response = await taxRecordService.create(
                submitData,
                selectedFile
            )

            if (response.success) {
                showToast("Data PBB berhasil ditambahkan!", "success")
                reset()
                setSelectedFile(null)
                setPreviewUrl(null)
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
            <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                            Tambah Data PBB
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600">
                            Isi form di bawah untuk menambahkan data Pajak Bumi
                            dan Bangunan (PBB) baru
                        </p>
                    </div>
                    <button
                        onClick={handleCancel}
                        className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base"
                    >
                        Kembali
                    </button>
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="p-4 sm:p-6 space-y-4 sm:space-y-6"
                    >
                        {/* Basic Information */}
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                                Informasi Dasar
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                        Nama Pemilik{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        {...register("name")}
                                        type="text"
                                        placeholder="Nama pemilik properti"
                                        className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm ${
                                            errors.name
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-xs sm:text-sm text-red-600">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                        Alamat{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        {...register("address")}
                                        type="text"
                                        placeholder="Alamat properti"
                                        className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm ${
                                            errors.address
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {errors.address && (
                                        <p className="mt-1 text-xs sm:text-sm text-red-600">
                                            {errors.address.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tax Information */}
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                                Informasi Pajak
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                        Jenis Pajak
                                    </label>
                                    <input
                                        {...register("tax_type")}
                                        type="text"
                                        value="PBB"
                                        readOnly
                                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-xs sm:text-sm"
                                    />
                                    <p className="mt-1 text-xs sm:text-sm text-gray-500">
                                        Pajak Bumi dan Bangunan
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                        Nomor SPT{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        {...register("spt_number")}
                                        type="text"
                                        placeholder="Nomor SPT"
                                        className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm ${
                                            errors.spt_number
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {errors.spt_number && (
                                        <p className="mt-1 text-xs sm:text-sm text-red-600">
                                            {errors.spt_number.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                        Tahun
                                    </label>
                                    <input
                                        {...register("year")}
                                        type="text"
                                        value="2025"
                                        readOnly
                                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-xs sm:text-sm"
                                    />
                                    <p className="mt-1 text-xs sm:text-sm text-gray-500">
                                        Tahun Pajak 2025
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Amount and Status */}
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                                Jumlah dan Status
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                        Jumlah PBB (Rp){" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        {...register("amount")}
                                        type="text"
                                        placeholder="0"
                                        className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm ${
                                            errors.amount
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {errors.amount && (
                                        <p className="mt-1 text-xs sm:text-sm text-red-600">
                                            {errors.amount.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                        Status Pembayaran
                                    </label>
                                    <select
                                        {...register("status")}
                                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                                    >
                                        <option value="belum_lunas">
                                            Belum Lunas
                                        </option>
                                        <option value="proses">Proses</option>
                                        <option value="lunas">Lunas</option>
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-xs sm:text-sm text-red-600">
                                            {errors.status.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Payment Proof Upload */}
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                                Bukti Pembayaran
                            </h3>
                            <div className="space-y-3 sm:space-y-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                        Foto Bukti Pembayaran
                                    </label>
                                    <div className="space-y-2">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                                        />
                                        <p className="text-xs sm:text-sm text-gray-500">
                                            Format: JPG, PNG, GIF. Maksimal 5MB
                                        </p>
                                    </div>
                                </div>

                                {previewUrl && (
                                    <div className="space-y-2">
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700">
                                            Preview:
                                        </label>
                                        <div className="relative inline-block">
                                            <img
                                                src={previewUrl}
                                                alt="Preview bukti pembayaran"
                                                className="max-w-xs max-h-48 rounded-lg border border-gray-300"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeFile}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Dates */}
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                                Tanggal
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                        Tanggal Jatuh Tempo{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        {...register("due_date")}
                                        type="date"
                                        className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm ${
                                            errors.due_date
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {errors.due_date && (
                                        <p className="mt-1 text-xs sm:text-sm text-red-600">
                                            {errors.due_date.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                        Tanggal Pembayaran
                                    </label>
                                    <input
                                        {...register("payment_date")}
                                        type="date"
                                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description and Notes */}
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                                Keterangan
                            </h3>
                            <div className="space-y-3 sm:space-y-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                        Deskripsi
                                    </label>
                                    <input
                                        {...register("description")}
                                        type="text"
                                        placeholder="Deskripsi singkat tentang pajak ini"
                                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                        Catatan
                                    </label>
                                    <textarea
                                        {...register("notes")}
                                        rows={4}
                                        placeholder="Catatan tambahan (opsional)"
                                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-xs sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-4 sm:px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Menyimpan...</span>
                                    </>
                                ) : (
                                    <>
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
