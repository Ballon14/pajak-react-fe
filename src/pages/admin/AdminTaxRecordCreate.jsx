import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AdminLayout, Toast } from "../../components/ui"
import { userService } from "../../services/userService"
import { taxRecordService } from "../../services/taxRecordService"

const AdminTaxRecordCreate = () => {
    const [users, setUsers] = useState([])
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [formData, setFormData] = useState({
        user_id: "",
        name: "",
        address: "",
        tax_type: "PBB",
        spt_number: "",
        year: new Date().getFullYear(),
        amount: "",
        description: "",
        status: "belum_lunas",
        due_date: "",
        payment_date: "",
        notes: "",
    })
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        loadUsers()
    }, [])

    const showToast = (message, type = "info") => setToast({ message, type })

    const loadUsers = async () => {
        try {
            const response = await userService.getUsers()
            if (response.success) {
                const list = (response.data?.data || []).map((u) => ({
                    id: u.id || u._id,
                    name: u.name,
                    email: u.email,
                }))
                setUsers(list)
            } else {
                showToast(response.message || "Gagal memuat users", "error")
            }
        } catch (err) {
            showToast(err.message || "Gagal memuat users", "error")
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
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
        if (!formData.user_id)
            return showToast("Pilih user terlebih dahulu", "warning")
        if (
            !formData.name ||
            !formData.address ||
            !formData.spt_number ||
            !formData.amount
        ) {
            return showToast("Mohon lengkapi semua field wajib", "warning")
        }

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

            const payload = {
                ...formData,
                year: parseInt(formData.year),
                amount: parseFloat(formData.amount),
                due_date: formatDate(formData.due_date),
                payment_date: formatDate(formData.payment_date),
            }
            if (payload.status !== "lunas") {
                payload.payment_date = null
            }
            const response = await taxRecordService.createAdmin(
                payload,
                selectedFile
            )
            if (response.success) {
                showToast("Data pajak berhasil ditambahkan", "success")
                setTimeout(() => navigate("/admin/tax-records"), 1200)
            } else {
                showToast(
                    response.message || "Gagal menambahkan data pajak",
                    "error"
                )
            }
        } catch (err) {
            showToast(err.message || "Gagal menambahkan data pajak", "error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <AdminLayout>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                            Tambah Data Pajak (Admin)
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600">
                            Admin dapat menambahkan data pajak untuk user
                            manapun
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/admin/tax-records")}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base"
                    >
                        Batal
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4 sm:space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    User
                                </label>
                                <select
                                    name="user_id"
                                    value={formData.user_id}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base"
                                >
                                    <option value="">Pilih user</option>
                                    {users.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.name} ({u.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama
                                </label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Alamat
                                </label>
                                <input
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nomor SPT
                                </label>
                                <input
                                    name="spt_number"
                                    value={formData.spt_number}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tahun
                                </label>
                                <input
                                    type="number"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Jumlah
                                </label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base"
                                >
                                    <option value="belum_lunas">
                                        Belum Lunas
                                    </option>
                                    <option value="proses">Proses</option>
                                    <option value="lunas">Lunas</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Jatuh Tempo
                                </label>
                                <input
                                    type="date"
                                    name="due_date"
                                    value={formData.due_date}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tanggal Bayar
                                </label>
                                <input
                                    type="date"
                                    name="payment_date"
                                    value={formData.payment_date}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base"
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Deskripsi
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base"
                                    rows="3"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Catatan
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base"
                                    rows="3"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                            <button
                                type="button"
                                onClick={() => navigate("/admin/tax-records")}
                                className="px-4 sm:px-6 py-2 border rounded-lg text-sm sm:text-base"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 sm:px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm sm:text-base"
                            >
                                {loading ? "Menyimpan..." : "Simpan"}
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
        </AdminLayout>
    )
}

export default AdminTaxRecordCreate
