import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    AdminLayout,
    DataTable,
    Toast,
    ConfirmModal,
} from "../../components/ui"
import { authService } from "../../services/authService"
import { taxRecordService } from "../../services/taxRecordService"

const AdminTaxRecords = () => {
    const [user, setUser] = useState(null)
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState(null)
    const navigate = useNavigate()

    // Edit modal state
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editingRecord, setEditingRecord] = useState(null)
    const [editForm, setEditForm] = useState({
        name: "",
        address: "",
        tax_type: "PBB",
        spt_number: "",
        year: "",
        amount: "",
        description: "",
        status: "belum_lunas",
        due_date: "",
        payment_date: "",
        notes: "",
    })
    const [saving, setSaving] = useState(false)
    const [editLoading, setEditLoading] = useState(false)

    // Confirm modal for delete
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [deletingRecord, setDeletingRecord] = useState(null)

    useEffect(() => {
        const userData = authService.getUserFromStorage()
        setUser(userData)
        loadRecords()
    }, [])

    const showToast = (message, type = "info") => setToast({ message, type })

    const loadRecords = async () => {
        try {
            setLoading(true)
            const response = await taxRecordService.getTaxRecords()
            if (response.success) {
                const list = response.data?.data || []
                setRecords(list)
            } else {
                showToast(
                    response.message || "Gagal memuat data pajak",
                    "error"
                )
            }
        } catch (err) {
            showToast(err.message || "Gagal memuat data pajak", "error")
        } finally {
            setLoading(false)
        }
    }

    const handleViewDetail = (record) => {
        const recordId = record.id || record._id
        navigate(`/admin/tax-records/${recordId}`)
    }

    const handleEdit = async (record) => {
        try {
            setEditLoading(true)
            const recordId = record.id || record._id
            const response = await taxRecordService.getByIdAdmin(recordId)

            if (response.success) {
                const freshData = response.data
                setEditingRecord(freshData)
                setEditForm({
                    name: freshData.name || "",
                    address: freshData.address || "",
                    tax_type: freshData.tax_type || "PBB",
                    spt_number: freshData.spt_number || "",
                    year: freshData.year || "",
                    amount: freshData.amount || freshData.total || "",
                    description: freshData.description || "",
                    status: freshData.status || "belum_lunas",
                    due_date: freshData.due_date
                        ? new Date(freshData.due_date)
                              .toISOString()
                              .split("T")[0]
                        : "",
                    payment_date: freshData.payment_date
                        ? new Date(freshData.payment_date)
                              .toISOString()
                              .split("T")[0]
                        : "",
                    notes: freshData.notes || "",
                })
                setIsEditOpen(true)
            } else {
                showToast(
                    response.message || "Gagal memuat data pajak untuk edit",
                    "error"
                )
            }
        } catch (err) {
            showToast(
                err.message || "Gagal memuat data pajak untuk edit",
                "error"
            )
        } finally {
            setEditLoading(false)
        }
    }

    const askDelete = (record) => {
        setDeletingRecord(record)
        setConfirmOpen(true)
    }

    const confirmDelete = async () => {
        if (!deletingRecord) return
        const recordId = deletingRecord.id || deletingRecord._id
        try {
            const response = await taxRecordService.delete(recordId)
            if (response.success) {
                showToast("Data pajak berhasil dihapus", "success")
                await loadRecords()
            } else {
                showToast(
                    response.message || "Gagal menghapus data pajak",
                    "error"
                )
            }
        } catch (err) {
            showToast(err.message || "Gagal menghapus data pajak", "error")
        } finally {
            setConfirmOpen(false)
            setDeletingRecord(null)
        }
    }

    const cancelDelete = () => {
        setConfirmOpen(false)
        setDeletingRecord(null)
    }

    const handleEditChange = (e) => {
        const { name, value } = e.target
        setEditForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const closeEditModal = () => {
        setIsEditOpen(false)
        setEditingRecord(null)
        setEditForm({
            name: "",
            address: "",
            tax_type: "PBB",
            spt_number: "",
            year: "",
            amount: "",
            description: "",
            status: "belum_lunas",
            due_date: "",
            payment_date: "",
            notes: "",
        })
    }

    const handleSaveEdit = async () => {
        if (!editingRecord) return
        if (
            !editForm.name ||
            !editForm.address ||
            !editForm.tax_type ||
            !editForm.spt_number ||
            !editForm.year ||
            !editForm.amount
        ) {
            showToast("Mohon lengkapi semua field yang wajib diisi", "warning")
            return
        }
        if (editForm.status === "lunas" && !editForm.payment_date) {
            showToast(
                "Tanggal pembayaran wajib diisi jika status Lunas",
                "warning"
            )
            return
        }
        try {
            setSaving(true)
            const recordId = editingRecord.id || editingRecord._id
            const updateData = {
                ...editForm,
                year: parseInt(editForm.year),
                amount: parseFloat(editForm.amount),
            }
            if (editForm.status !== "lunas") {
                updateData.payment_date = null
            }
            const response = await taxRecordService.updateAdmin(
                recordId,
                updateData
            )
            if (response.success) {
                showToast("Data pajak berhasil diperbarui", "success")
                closeEditModal()
                await loadRecords()
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

    const columns = {
        avatar: (record) => (
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                    {record.name?.charAt(0)?.toUpperCase() || "T"}
                </span>
            </div>
        ),
        primary: (record) => record.name,
        secondary: (record) =>
            `${record.tax_type} - ${record.year} • ${record.user?.name || "-"}`,
        badge: (record) => ({
            text:
                record.status === "lunas"
                    ? "Lunas"
                    : record.status === "proses"
                    ? "Proses"
                    : "Belum Lunas",
            color:
                record.status === "lunas"
                    ? "green"
                    : record.status === "proses"
                    ? "yellow"
                    : "red",
        }),
        amount: (record) =>
            new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
            }).format(record.total || record.amount || 0),
        actions: (record) => [
            {
                label: "Detail",
                onClick: () => handleViewDetail(record),
                color: "blue",
            },
            {
                label: editLoading ? "Loading..." : "Edit",
                onClick: () => !editLoading && handleEdit(record),
                color: "yellow",
                disabled: editLoading,
            },
            { label: "Delete", onClick: () => askDelete(record), color: "red" },
        ],
    }

    return (
        <AdminLayout user={user}>
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Data Pajak (Admin)
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Lihat semua data pajak dari seluruh pengguna
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={loadRecords}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium"
                        >
                            Refresh
                        </button>
                        <button
                            onClick={() =>
                                navigate("/admin/tax-records/create")
                            }
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                        >
                            Tambah Data
                        </button>
                    </div>
                </div>

                {/* Quick Status Overview */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <button
                                onClick={() => {
                                    const belumLunasRecords = records.filter(
                                        (r) => r.status === "belum_lunas"
                                    )
                                    if (belumLunasRecords.length === 0) {
                                        showToast(
                                            "Tidak ada data dengan status Belum Lunas",
                                            "info"
                                        )
                                        return
                                    }
                                    showToast(
                                        `Ditemukan ${belumLunasRecords.length} data Belum Lunas`,
                                        "info"
                                    )
                                }}
                                className="w-full bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg font-medium transition-colors"
                            >
                                <div className="text-2xl font-bold">
                                    {
                                        records.filter(
                                            (r) => r.status === "belum_lunas"
                                        ).length
                                    }
                                </div>
                                <div className="text-sm">Belum Lunas</div>
                            </button>
                        </div>
                        <div className="text-center">
                            <button
                                onClick={() => {
                                    const prosesRecords = records.filter(
                                        (r) => r.status === "proses"
                                    )
                                    if (prosesRecords.length === 0) {
                                        showToast(
                                            "Tidak ada data dengan status Proses",
                                            "info"
                                        )
                                        return
                                    }
                                    showToast(
                                        `Ditemukan ${prosesRecords.length} data Proses`,
                                        "info"
                                    )
                                }}
                                className="w-full bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded-lg font-medium transition-colors"
                            >
                                <div className="text-2xl font-bold">
                                    {
                                        records.filter(
                                            (r) => r.status === "proses"
                                        ).length
                                    }
                                </div>
                                <div className="text-sm">Proses</div>
                            </button>
                        </div>
                        <div className="text-center">
                            <button
                                onClick={() => {
                                    const lunasRecords = records.filter(
                                        (r) => r.status === "lunas"
                                    )
                                    if (lunasRecords.length === 0) {
                                        showToast(
                                            "Tidak ada data dengan status Lunas",
                                            "info"
                                        )
                                        return
                                    }
                                    showToast(
                                        `Ditemukan ${lunasRecords.length} data Lunas`,
                                        "info"
                                    )
                                }}
                                className="w-full bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg font-medium transition-colors"
                            >
                                <div className="text-2xl font-bold">
                                    {
                                        records.filter(
                                            (r) => r.status === "lunas"
                                        ).length
                                    }
                                </div>
                                <div className="text-sm">Lunas</div>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Daftar Data Pajak
                        </h3>
                    </div>
                    {loading ? (
                        <div className="p-6">
                            <div className="animate-pulse space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="h-16 bg-gray-100 rounded-xl"
                                    ></div>
                                ))}
                            </div>
                        </div>
                    ) : records.length === 0 ? (
                        <div className="p-6 text-center text-gray-600">
                            Belum ada data pajak
                        </div>
                    ) : (
                        <div className="p-4">
                            <DataTable
                                title="Recent Tax Records"
                                icon="tax"
                                data={records}
                                columns={columns}
                                emptyMessage="Belum ada data pajak"
                                emptyIcon="tax"
                                maxItems={records.length}
                                totalCount={records.length}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Tax Record Modal */}
            {isEditOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Edit Data Pajak
                                </h3>
                                {editLoading && (
                                    <div className="flex items-center gap-2 text-sm text-blue-600">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                        Loading data...
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={closeEditModal}
                                className="text-gray-500 hover:text-gray-700"
                                aria-label="Close"
                                disabled={editLoading}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
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
                                        value={editForm.name}
                                        onChange={handleEditChange}
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
                                        value={editForm.address}
                                        onChange={handleEditChange}
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
                                        value={editForm.tax_type}
                                        onChange={handleEditChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
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
                                        value={editForm.spt_number}
                                        onChange={handleEditChange}
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
                                        value={editForm.year}
                                        onChange={handleEditChange}
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
                                        value={editForm.amount}
                                        onChange={handleEditChange}
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
                                        value={editForm.status}
                                        onChange={handleEditChange}
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
                                        value={editForm.due_date}
                                        onChange={handleEditChange}
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
                                        value={editForm.payment_date}
                                        onChange={handleEditChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={editForm.status !== "lunas"}
                                    />
                                    {editForm.status !== "lunas" && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Tanggal pembayaran hanya bisa diisi
                                            jika status Lunas
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
                                    value={editForm.description}
                                    onChange={handleEditChange}
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
                                    value={editForm.notes}
                                    onChange={handleEditChange}
                                    rows="3"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Catatan tambahan"
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
                            <button
                                onClick={closeEditModal}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                disabled={saving}
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-60"
                                disabled={saving}
                            >
                                {saving ? "Menyimpan..." : "Simpan Perubahan"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                    title="Hapus Data Pajak"
                    message={`Apakah Anda yakin ingin menghapus data pajak "${
                        deletingRecord?.name ||
                        deletingRecord?.spt_number ||
                        "(tanpa nama)"
                    }"?\nTindakan ini tidak dapat dibatalkan.`}
                    confirmText="Hapus"
                    cancelText="Batal"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </AdminLayout>
    )
}

export default AdminTaxRecords
