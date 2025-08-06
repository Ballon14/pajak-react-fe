import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom"
import Login from "./components/Login"
import Register from "./components/Register"
import Dashboard from "./components/Dashboard"
import AdminDashboard from "./components/AdminDashboard"
import TaxRecords from "./components/TaxRecords"
import AddTaxRecord from "./components/AddTaxRecord"
import EditTaxRecord from "./components/EditTaxRecord"
import DetailTaxRecord from "./components/DetailTaxRecord"
import Reports from "./components/Reports"
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
                        path="/"
                        element={<Navigate to="/login" replace />}
                    />
                </Routes>
            </div>
        </Router>
    )
}

export default App
