import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import './styles/App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" replace />;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Settings Page - Now Working! */}
                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    }
                />

                {/* Placeholder routes for other pages */}
                <Route
                    path="/beneficiaries"
                    element={
                        <ProtectedRoute>
                            <ComingSoon page="Beneficiaries" />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/programs"
                    element={
                        <ProtectedRoute>
                            <ComingSoon page="Programs" />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/activities"
                    element={
                        <ProtectedRoute>
                            <ComingSoon page="Activities" />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/approvals"
                    element={
                        <ProtectedRoute>
                            <ComingSoon page="Approvals" />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/reports"
                    element={
                        <ProtectedRoute>
                            <ComingSoon page="Reports" />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/analytics"
                    element={
                        <ProtectedRoute>
                            <ComingSoon page="Analytics" />
                        </ProtectedRoute>
                    }
                />

                {/* Default Route */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* 404 Route */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Router>
    );
}

// Coming Soon Component for placeholder pages
const ComingSoon = ({ page }) => {
    return (
        <div className="app-container">
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                flexDirection: 'column',
                gap: '20px'
            }}>
                <div style={{ fontSize: '80px' }}>🚧</div>
                <h1 style={{ fontSize: '32px', color: '#2c3e50' }}>{page} Module</h1>
                <p style={{ fontSize: '18px', color: '#7f8c8d' }}>Coming Soon!</p>
                <button
                    onClick={() => window.history.back()}
                    className="btn btn-primary"
                >
                    ← Go Back
                </button>
            </div>
        </div>
    );
};

export default App;