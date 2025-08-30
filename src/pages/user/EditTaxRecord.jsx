import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Layout, Toast } from "../../components/ui"
import { taxRecordService } from "../../services/taxRecordService"
import { getImageURL } from "../../utils/imageUtils"

const EditTaxRecord = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [existingPaymentProof, setExistingPaymentProof] = useState(null)

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        tax_type: "",
        spt_number: "",
        year: "",
        amount: "",
        description: "",
        status: "",
        due_date: "",
        payment_date: "",
        notes: "",
    })

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

                setFormData({
                    name: recordData.name || "",
                    address: recordData.address || "",
                    tax_type: recordData.tax_type || "",
                    spt_number: recordData.spt_number || "",
                    year: recordData.year ? recordData.year.toString() : "",
                    amount: recordData.amount
                        ? recordData.amount.toString()
                        : "",
                    description: recordData.description || "",
                    status: recordData.status || "",
                    due_date: recordData.due_date
                        ? new Date(recordData.due_date)
                              .toISOString()
                              .split("T")[0]
                        : "",
                    payment_date: recordData.payment_date
                        ? new Date(recordData.payment_date)
                              .toISOString()
                              .split("T")[0]
                        : "",
                    notes: recordData.notes || "",
                })

                // Set existing payment proof if available
                if (recordData.payment_proof) {
                    setExistingPaymentProof(recordData.payment_proof)
                }
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

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)

        try {
            // Validate required fields
            if (
                !formData.name ||
                !formData.address ||
                !formData.tax_type ||
                !formData.spt_number ||
                !formData.amount
            ) {
                showToast("Mohon lengkapi data yang wajib diisi", "warning")
                setSaving(false)
                return
            }

            // Validate amount is a valid number
            const amountValue = parseFloat(formData.amount)
            if (isNaN(amountValue) || amountValue <= 0) {
                showToast(
                    "Jumlah pajak harus berupa angka yang valid",
                    "warning"
                )
                setSaving(false)
                return
            }

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

            const updateData = {
                ...formData,
                tax_type: "PBB",
                amount: amountValue,
                year: 2025,
                due_date: formatDate(formData.due_date),
                payment_date: formatDate(formData.payment_date),
            }

            const response = await taxRecordService.update(
                id,
                updateData,
                selectedFile
            )

            if (response.success) {
                showToast("Data PBB berhasil diperbarui", "success")
                setTimeout(() => {
                    navigate("/tax-records")
                }, 1500)
            } else {
                showToast(
                    response.message || "Gagal memperbarui data PBB",
                    "error"
                )
            }
        } catch (error) {
            console.error("❌ Error updating tax record:", error)
            console.error("Error details:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            })
            showToast("Gagal memperbarui data PBB", "error")
        } finally {
            setSaving(false)
        }
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

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Edit Data PBB
                        </h1>
                        <p className="text-gray-600">
                            Perbarui data Pajak Bumi dan Bangunan (PBB)
                        </p>
                    </div>
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

                {/* Form */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Masukkan nama lengkap"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Alamat{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Masukkan alamat lengkap"
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Tax Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jenis Pajak{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="tax_type"
                                    value="PBB"
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Pajak Bumi dan Bangunan
                                </p>
                            </div>

                            {/* SPT Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nomor SPT{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="spt_number"
                                    value={formData.spt_number}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Contoh: SPT-2024-001"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Year */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tahun
                                </label>
                                <input
                                    type="text"
                                    name="year"
                                    value="2025"
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Tahun Pajak 2025
                                </p>
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jumlah Pajak{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    step="1000"
                                    placeholder="Contoh: 2500000"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status Pembayaran
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Pilih Status</option>
                                    <option value="lunas">Lunas</option>
                                    <option value="belum_lunas">
                                        Belum Lunas
                                    </option>
                                    <option value="proses">Proses</option>
                                </select>
                            </div>

                            {/* Due Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tanggal Jatuh Tempo
                                </label>
                                <input
                                    type="date"
                                    name="due_date"
                                    value={formData.due_date}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Payment Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tanggal Pembayaran
                                </label>
                                <input
                                    type="date"
                                    name="payment_date"
                                    value={formData.payment_date}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
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

                                {/* Existing Payment Proof */}
                                {existingPaymentProof && !previewUrl && (
                                    <div className="space-y-2">
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700">
                                            Bukti Pembayaran Saat Ini:
                                        </label>
                                        <div className="relative inline-block">
                                            <img
                                                src={getImageURL(
                                                    existingPaymentProof
                                                )}
                                                alt="Bukti pembayaran saat ini"
                                                crossOrigin="anonymous"
                                                className="max-w-xs max-h-48 rounded-lg border border-gray-300"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* New File Preview */}
                                {previewUrl && (
                                    <div className="space-y-2">
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700">
                                            Preview File Baru:
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

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Deskripsi
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="Deskripsi detail tentang pajak ini..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Catatan
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="Catatan tambahan..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate("/tax-records")}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                            >
                                {saving ? (
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
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span>Simpan Perubahan</span>
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

export default EditTaxRecord
