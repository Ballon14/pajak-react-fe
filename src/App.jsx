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
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/tax-records"
                        element={
                            <ProtectedRoute>
                                <TaxRecords />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/tax-records/create"
                        element={
                            <ProtectedRoute>
                                <AddTaxRecord />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/tax-records/:id"
                        element={
                            <ProtectedRoute>
                                <DetailTaxRecord />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/tax-records/:id/edit"
                        element={
                            <ProtectedRoute>
                                <EditTaxRecord />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/reports"
                        element={
                            <ProtectedRoute>
                                <Reports />
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
