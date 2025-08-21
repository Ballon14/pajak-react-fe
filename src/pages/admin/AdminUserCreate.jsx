import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AdminLayout, Toast } from "../../components/ui"
import { userService } from "../../services/userService"

const AdminUserCreate = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        is_admin: false,
        is_active: true,
    })
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState(null)
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)

    const showToast = (message, type = "info") => setToast({ message, type })

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.name || !form.email || !form.password) {
            return showToast("Nama, email, dan password wajib diisi", "warning")
        }
        if (form.password.length < 6) {
            return showToast("Password minimal 6 karakter", "warning")
        }
        setSaving(true)
        try {
            const response = await userService.createUser(form)
            if (response.success) {
                showToast("User berhasil dibuat", "success")
                setTimeout(() => navigate("/admin/users"), 1200)
            } else {
                showToast(response.message || "Gagal membuat user", "error")
            }
        } catch (err) {
            showToast(err.message || "Gagal membuat user", "error")
        } finally {
            setSaving(false)
        }
    }

    return (
        <AdminLayout>
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Tambah User
                        </h1>
                        <p className="text-gray-600">
                            Buat user baru dan atur rolenya
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/admin/users")}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                    >
                        Batal
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama
                                </label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((v) => !v)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
                                        aria-label={
                                            showPassword
                                                ? "Sembunyikan password"
                                                : "Lihat password"
                                        }
                                    >
                                        {showPassword ? "Sembunyi" : "Lihat"}
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_admin"
                                        checked={form.is_admin}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        Admin
                                    </span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={form.is_active}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        Active
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button
                                type="button"
                                onClick={() => navigate("/admin/users")}
                                className="px-6 py-2 border rounded-lg"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                            >
                                {saving ? "Menyimpan..." : "Simpan"}
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

export default AdminUserCreate
