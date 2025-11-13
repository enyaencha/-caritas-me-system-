import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import DataEntry from './pages/DataEntry';
import BeneficiaryList from './pages/BeneficiaryList';
import BeneficiaryForm from './pages/BeneficiaryForm';
import BeneficiaryDetails from './pages/BeneficiaryDetails';
import ProgramList from './pages/ProgramList';
import ProgramForm from './pages/ProgramForm';
import ProgramDetails from './pages/ProgramDetails';
import Approvals from './pages/Approvals';
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

                {/* Data Entry Page */}
                <Route
                    path="/data-entry"
                    element={
                        <ProtectedRoute>
                            <DataEntry />
                        </ProtectedRoute>
                    }
                />

                {/* Beneficiary Routes */}
                <Route
                    path="/beneficiaries"
                    element={
                        <ProtectedRoute>
                            <BeneficiaryList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/beneficiaries/create"
                    element={
                        <ProtectedRoute>
                            <BeneficiaryForm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/beneficiaries/edit/:id"
                    element={
                        <ProtectedRoute>
                            <BeneficiaryForm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/beneficiaries/:id"
                    element={
                        <ProtectedRoute>
                            <BeneficiaryDetails />
                        </ProtectedRoute>
                    }
                />

                {/* Program Routes */}
                <Route
                    path="/programs"
                    element={
                        <ProtectedRoute>
                            <ProgramList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/programs/create"
                    element={
                        <ProtectedRoute>
                            <ProgramForm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/programs/edit/:id"
                    element={
                        <ProtectedRoute>
                            <ProgramForm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/programs/:id"
                    element={
                        <ProtectedRoute>
                            <ProgramDetails />
                        </ProtectedRoute>
                    }
                />

                {/* Approvals Page */}
                <Route
                    path="/approvals"
                    element={
                        <ProtectedRoute>
                            <Approvals />
                        </ProtectedRoute>
                    }
                />

                {/* Placeholder routes for other pages */}
                <Route
                    path="/activities"
                    element={
                        <ProtectedRoute>
                            <ComingSoon page="Activities" />
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