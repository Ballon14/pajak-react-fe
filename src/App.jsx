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
import { AdminDashboard, Users, AdminTaxRecords } from "./pages"
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
                        path="/admin/tax-records"
                        element={
                            <ProtectedRoute requireAdmin={true}>
                                <AdminTaxRecords />
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
