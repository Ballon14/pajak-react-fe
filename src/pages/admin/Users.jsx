import React, { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { authService } from "../../services/authService"
import { userService } from "../../services/userService"
import { AdminLayout, Toast, ConfirmModal } from "../../components/ui"

const Users = () => {
    const [user, setUser] = useState(null)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const location = useLocation()
    // Edit modal state
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [editForm, setEditForm] = useState({
        name: "",
        email: "",
        is_admin: false,
        is_active: true,
    })
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState(null)

    // Confirm modal state for delete
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [deletingUserId, setDeletingUserId] = useState(null)

    const showToast = (message, type = "info") => {
        setToast({ message, type })
    }

    useEffect(() => {
        const userData = authService.getUserFromStorage()
        setUser(userData)
        loadUsers()
    }, [])

    // Open modal when coming from other pages with ?edit=<id>
    useEffect(() => {
        if (!users || users.length === 0) return
        const params = new URLSearchParams(location.search)
        const editId = params.get("edit")
        if (editId) {
            handleEditUser(editId)
            // Clean the query param to avoid reopening on state updates
            navigate("/admin/users", { replace: true })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search, users])

    const loadUsers = async () => {
        try {
            setLoading(true)
            const response = await userService.getUsers()

            if (response.success) {
                const raw = response.data.data || []
                const normalized = raw.map((u) => ({ ...u, id: u.id || u._id }))
                setUsers(normalized)
            } else {
                console.error("Failed to load users:", response.message)
            }
        } catch (error) {
            console.error("Error loading users:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleEditUser = (userId) => {
        const selected = users.find(
            (u) => String(u.id || u._id) === String(userId)
        )
        if (!selected) return
        setEditingUser(selected)
        setEditForm({
            name: selected.name || "",
            email: selected.email || "",
            is_admin: !!selected.is_admin,
            is_active: !!selected.is_active,
        })
        setIsEditOpen(true)
    }

    const handleDeleteUser = async (userId) => {
        setDeletingUserId(userId)
        setConfirmOpen(true)
    }

    const confirmDelete = async () => {
        try {
            // Implement delete user logic here
            console.log("Deleting user:", deletingUserId)
            await loadUsers()
        } catch (error) {
            console.error("Error deleting user:", error)
        } finally {
            setConfirmOpen(false)
            setDeletingUserId(null)
        }
    }

    const cancelDelete = () => {
        setConfirmOpen(false)
        setDeletingUserId(null)
    }

    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target
        setEditForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    const closeEditModal = () => {
        setIsEditOpen(false)
        setEditingUser(null)
    }

    const handleSaveEdit = async () => {
        if (!editingUser) return
        if (!editForm.name || !editForm.email) {
            showToast("Nama dan email wajib diisi", "warning")
            return
        }
        setSaving(true)
        try {
            const payload = {
                name: editForm.name,
                email: editForm.email,
                is_admin: editForm.is_admin,
                is_active: editForm.is_active,
            }
            const targetId = editingUser.id || editingUser._id
            const response = await userService.updateUser(targetId, payload)
            if (response.success) {
                showToast(
                    response.message || "User berhasil diperbarui",
                    "success"
                )
                closeEditModal()
                await loadUsers()
            } else {
                showToast(response.message || "Gagal memperbarui user", "error")
            }
        } catch (error) {
            showToast(error.message || "Gagal memperbarui user", "error")
        } finally {
            setSaving(false)
        }
    }

    return (
        <AdminLayout user={user}>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Kelola Users
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Lihat dan kelola semua pengguna sistem
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/admin/users/create")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        Tambah User
                    </button>
                </div>

                {/* Users Table */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Daftar Users
                        </h3>
                    </div>

                    {loading ? (
                        <div className="p-6">
                            <div className="animate-pulse space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="flex items-center space-x-4"
                                    >
                                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                        <div className="h-8 bg-gray-200 rounded w-20"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Belum ada users
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Mulai dengan menambahkan user pertama
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {users.map((userItem) => (
                                        <tr
                                            key={userItem.id || userItem._id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                                        <span className="text-white font-bold text-sm">
                                                            {userItem.name
                                                                ?.charAt(0)
                                                                ?.toUpperCase() ||
                                                                "U"}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {userItem.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {userItem.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        userItem.is_active
                                                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                                                            : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                                                    }`}
                                                >
                                                    {userItem.is_active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        userItem.is_admin
                                                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                                                            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                                    }`}
                                                >
                                                    {userItem.is_admin
                                                        ? "Admin"
                                                        : "User"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() =>
                                                        handleEditUser(
                                                            userItem.id ||
                                                                userItem._id
                                                        )
                                                    }
                                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteUser(
                                                            userItem.id ||
                                                                userItem._id
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    Delete
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

            {/* Edit User Modal */}
            {isEditOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg mx-4">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Edit User
                            </h3>
                            <button
                                onClick={closeEditModal}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                aria-label="Close"
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
                        <div className="px-6 py-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Nama
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editForm.name}
                                    onChange={handleEditChange}
                                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nama pengguna"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editForm.email}
                                    onChange={handleEditChange}
                                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="email@domain.com"
                                />
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_admin"
                                        checked={editForm.is_admin}
                                        onChange={handleEditChange}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                        Admin
                                    </span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={editForm.is_active}
                                        onChange={handleEditChange}
                                        className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                        Active
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3">
                            <button
                                onClick={closeEditModal}
                                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                                disabled={saving}
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60"
                                disabled={saving}
                            >
                                {saving ? "Menyimpan..." : "Simpan"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            {confirmOpen && (
                <ConfirmModal
                    isOpen={confirmOpen}
                    title="Hapus User"
                    message={
                        "Apakah Anda yakin ingin menghapus user ini?\nTindakan ini tidak dapat dibatalkan."
                    }
                    confirmText="Hapus"
                    cancelText="Batal"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}

            {/* Toast Notification */}
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

export default Users
