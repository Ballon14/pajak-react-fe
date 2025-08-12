import React, { useEffect, useState } from "react"
import { AdminLayout, DataTable, Toast } from "../../components/ui"
import { authService } from "../../services/authService"
import { taxRecordService } from "../../services/taxRecordService"

const AdminTaxRecords = () => {
    const [user, setUser] = useState(null)
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState(null)

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

    const columns = {
        avatar: (record) => (
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                    {record.name?.charAt(0)?.toUpperCase() || "T"}
                </span>
            </div>
        ),
        primary: (record) => record.name,
        secondary: (record) => `${record.tax_type} - ${record.year}`,
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
                onClick: () =>
                    window.open(
                        `/tax-records/${record.id || record._id}`,
                        "_blank"
                    ),
                color: "blue",
            },
        ],
    }

    return (
        <AdminLayout user={user}>
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Data Pajak (Admin)
                        </h1>
                        <p className="text-gray-600">
                            Lihat semua data pajak dari seluruh pengguna
                        </p>
                    </div>
                    <button
                        onClick={loadRecords}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                        Refresh
                    </button>
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

export default AdminTaxRecords
