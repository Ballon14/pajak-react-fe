import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../services/authService"
import { userService } from "../services/userService"
import { taxRecordService } from "../services/taxRecordService"

const AdminDashboard = () => {
    const [user, setUser] = useState(null)
    const [users, setUsers] = useState([])
    const [taxRecords, setTaxRecords] = useState([])
    const [stats, setStats] = useState({})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const userData = authService.getUserFromStorage()
        setUser(userData)
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const [usersResponse, taxResponse, statsResponse] =
                await Promise.all([
                    userService.getUsers(),
                    taxRecordService.getTaxRecords(),
                    taxRecordService.getStatistics(),
                ])

            if (usersResponse.success) {
                setUsers(usersResponse.data.data || [])
            }

            if (taxResponse.success) {
                setTaxRecords(taxResponse.data.data || [])
            }

            if (statsResponse.success) {
                setStats(statsResponse.data)
            }
        } catch (error) {
            console.error("Error loading data:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            await authService.logout()
        } catch (error) {
            console.error("Error during logout:", error)
        } finally {
            authService.removeToken()
            authService.removeUser()
            navigate("/login")
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">
                                PajakApp Admin
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">
                                Admin: {user?.name}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                                            <span className="text-white font-bold">
                                                U
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Total Users
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {users.length}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                                            <span className="text-white font-bold">
                                                T
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Total Pajak
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {stats.total_records || 0}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                                            <span className="text-white font-bold">
                                                L
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Lunas
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {stats.lunas || 0}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                                            <span className="text-white font-bold">
                                                B
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Belum Lunas
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {stats.belum_lunas || 0}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Users */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Recent Users
                            </h3>
                        </div>
                        <ul className="divide-y divide-gray-200">
                            {users.slice(0, 5).map((user) => (
                                <li key={user.id} className="px-4 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {user.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    user.is_active
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {user.is_active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                            {user.is_admin && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    Admin
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Recent Tax Records */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Recent Tax Records
                            </h3>
                        </div>
                        <ul className="divide-y divide-gray-200">
                            {taxRecords.slice(0, 5).map((record) => (
                                <li key={record.id} className="px-4 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {record.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {record.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {record.user?.name} •{" "}
                                                    {record.year}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className="text-sm text-gray-900">
                                                Rp{" "}
                                                {record.total.toLocaleString()}
                                            </span>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    record.status === "lunas"
                                                        ? "bg-green-100 text-green-800"
                                                        : record.status ===
                                                          "proses"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {record.status}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default AdminDashboard
