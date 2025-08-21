import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom"
import { Login, Register } from "./pages"
import {
    Dashboard,
    TaxRecords,
    AddTaxRecord,
    EditTaxRecord,
    DetailTaxRecord,
    Reports,
} from "./pages"
import {
    AdminDashboard,
    Users,
    AdminTaxRecords,
    AdminTaxRecordDetail,
    AdminTaxRecordEdit,
    AdminTaxRecordCreate,
    AdminUserCreate,
    AdminReports,
    AdminChat,
    AdminSettings,
} from "./pages"
import { authService } from "./services/authService"
import { ChatWidget } from "./components/ui"
import { useEffect } from "react"

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const isAuthenticated = authService.isAuthenticated()
    const isAdmin = authService.isAdmin()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (requireAdmin && !isAdmin) {
        return <Navigate to="/dashboard" replace />
    }

    return children
}

function App() {
    // Initialize theme on app startup
    useEffect(() => {
        const initializeTheme = () => {
            try {
                // Check for admin settings first
                const adminSettings = localStorage.getItem("admin_settings")
                if (adminSettings) {
                    const parsed = JSON.parse(adminSettings)
                    if (parsed.theme) {
                        const root = document.documentElement
                        if (parsed.theme === "dark") {
                            root.classList.add("dark")
                        } else {
                            root.classList.remove("dark")
                        }
                        return
                    }
                }

                // Fallback to system preference
                if (
                    window.matchMedia &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches
                ) {
                    document.documentElement.classList.add("dark")
                } else {
                    document.documentElement.classList.remove("dark")
                }
            } catch (error) {
                console.error("Error initializing theme:", error)
            }
        }

        initializeTheme()
    }, [])

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <>
                                    <Dashboard />
                                    <ChatWidget />
                                </>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/tax-records"
                        element={
                            <ProtectedRoute>
                                <>
                                    <TaxRecords />
                                    <ChatWidget />
                                </>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/tax-records/create"
                        element={
                            <ProtectedRoute>
                                <>
                                    <AddTaxRecord />
                                    <ChatWidget />
                                </>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/tax-records/:id"
                        element={
                            <ProtectedRoute>
                                <>
                                    <DetailTaxRecord />
                                    <ChatWidget />
                                </>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/tax-records/:id/edit"
                        element={
                            <ProtectedRoute>
                                <>
                                    <EditTaxRecord />
                                    <ChatWidget />
                                </>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/reports"
                        element={
                            <ProtectedRoute>
                                <>
                                    <Reports />
                                    <ChatWidget />
                                </>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute requireAdmin={true}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/users"
                        element={
                            <ProtectedRoute requireAdmin={true}>
                                <Users />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/users/create"
                        element={
                            <ProtectedRoute requireAdmin={true}>
                                <AdminUserCreate />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/tax-records"
                        element={
                            <ProtectedRoute requireAdmin={true}>
                                <AdminTaxRecords />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/tax-records/create"
                        element={
                            <ProtectedRoute requireAdmin={true}>
                                <AdminTaxRecordCreate />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/tax-records/:id"
                        element={
                            <ProtectedRoute requireAdmin={true}>
                                <AdminTaxRecordDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/tax-records/:id/edit"
                        element={
                            <ProtectedRoute requireAdmin={true}>
                                <AdminTaxRecordEdit />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/reports"
                        element={
                            <ProtectedRoute requireAdmin={true}>
                                <AdminReports />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/chat"
                        element={
                            <ProtectedRoute requireAdmin={true}>
                                <AdminChat />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/settings"
                        element={
                            <ProtectedRoute requireAdmin={true}>
                                <AdminSettings />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/"
                        element={<Navigate to="/login" replace />}
                    />
                </Routes>
            </div>
        </Router>
    )
}

export default App
