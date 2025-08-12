import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AdminLayout, Toast } from "../../components/ui"
import { authService } from "../../services/authService"
import { taxRecordService } from "../../services/taxRecordService"

const AdminTaxRecordEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [record, setRecord] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState(null)
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        tax_type: "",
        spt_number: "",
        year: "",
        amount: "",
        description: "",
        status: "belum_lunas",
        due_date: "",
        payment_date: "",
        notes: "",
    })

    useEffect(() => {
        const userData = authService.getUserFromStorage()
        setUser(userData)
        if (id) {
            loadRecord()
        }
    }, [id])

    const showToast = (message, type = "info") => setToast({ message, type })

    const loadRecord = async () => {
        try {
            setLoading(true)
            const response = await taxRecordService.getByIdAdmin(id)
            if (response.success) {
                const data = response.data
                setRecord(data)
                setFormData({
                    name: data.name || "",
                    address: data.address || "",
                    tax_type: data.tax_type || "",
                    spt_number: data.spt_number || "",
                    year: data.year || "",
                    amount: data.amount || data.total || "",
                    description: data.description || "",
                    status: data.status || "belum_lunas",
                    due_date: data.due_date
                        ? new Date(data.due_date).toISOString().split("T")[0]
                        : "",
                    payment_date: data.payment_date
                        ? new Date(data.payment_date)
                              .toISOString()
                              .split("T")[0]
                        : "",
                    notes: data.notes || "",
                })
            } else {
                showToast(
                    response.message || "Data pajak tidak ditemukan",
                    "error"
                )
            }
        } catch (err) {
            showToast(err.message || "Gagal memuat data pajak", "error")
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

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        if (
            !formData.name ||
            !formData.address ||
            !formData.tax_type ||
            !formData.spt_number ||
            !formData.year ||
            !formData.amount
        ) {
            showToast("Mohon lengkapi semua field yang wajib diisi", "warning")
            return
        }

        if (formData.status === "lunas" && !formData.payment_date) {
            showToast(
                "Tanggal pembayaran wajib diisi jika status Lunas",
                "warning"
            )
            return
        }

        setSaving(true)
        try {
            const updateData = {
                ...formData,
                year: parseInt(formData.year),
                amount: parseFloat(formData.amount),
            }

            // Remove payment_date if status is not lunas
            if (formData.status !== "lunas") {
                updateData.payment_date = null
            }

            const response = await taxRecordService.update(id, updateData)
            if (response.success) {
                showToast("Data pajak berhasil diperbarui", "success")
                setTimeout(() => {
                    navigate("/admin/tax-records")
                }, 1500)
            } else {
                showToast(
                    response.message || "Gagal memperbarui data pajak",
                    "error"
                )
            }
        } catch (err) {
            showToast(err.message || "Gagal memperbarui data pajak", "error")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <AdminLayout user={user}>
                <div className="p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </AdminLayout>
        )
    }

    if (!record) {
        return (
            <AdminLayout user={user}>
                <div className="p-6 text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Data Pajak Tidak Ditemukan
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Data pajak dengan ID {id} tidak ditemukan atau telah
                        dihapus.
                    </p>
                    <button
                        onClick={() => navigate("/admin/tax-records")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                        Kembali ke Daftar
                    </button>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout user={user}>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Edit Data Pajak
                        </h1>
                        <p className="text-gray-600">
                            Edit data pajak: {record.name}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate("/admin/tax-records")}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Batal
                        </button>
                        <button
                            onClick={() => navigate(`/admin/tax-records/${id}`)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        >
                            Lihat Detail
                        </button>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="bg-white rounded-2xl shadow-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Form Edit Data Pajak
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama *{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nama pemilik properti"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Alamat *{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Alamat properti"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jenis Pajak *{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="tax_type"
                                    value={formData.tax_type}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Pilih Jenis Pajak</option>
                                    <option value="PBB">
                                        PBB (Pajak Bumi dan Bangunan)
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nomor SPT *{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="spt_number"
                                    value={formData.spt_number}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nomor SPT"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tahun *{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="2024"
                                    min="2020"
                                    max="2030"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jumlah Pajak *{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="1000000"
                                    min="0"
                                    step="1000"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status *{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="belum_lunas">
                                        Belum Lunas
                                    </option>
                                    <option value="proses">Proses</option>
                                    <option value="lunas">Lunas</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tanggal Jatuh Tempo *{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="due_date"
                                    value={formData.due_date}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tanggal Pembayaran
                                </label>
                                <input
                                    type="date"
                                    name="payment_date"
                                    value={formData.payment_date}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={formData.status !== "lunas"}
                                />
                                {formData.status !== "lunas" && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        Tanggal pembayaran hanya bisa diisi jika
                                        status Lunas
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Deskripsi
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Deskripsi properti atau objek pajak"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Catatan
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Catatan tambahan"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-6 border-t">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg font-medium transition-colors"
                            >
                                {saving ? "Menyimpan..." : "Simpan Perubahan"}
                            </button>
                        </div>
                    </form>
                </div>

                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </div>
        </AdminLayout>
    )
}

export default AdminTaxRecordEdit
