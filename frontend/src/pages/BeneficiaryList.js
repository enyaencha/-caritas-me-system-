// =====================================================
// BENEFICIARY LIST PAGE
// =====================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { beneficiaryAPI } from '../services/api';
import '../styles/App.css';

const BeneficiaryList = () => {
    const navigate = useNavigate();
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Pagination and filters
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    const [stats, setStats] = useState(null);

    // Fetch beneficiaries
    const fetchBeneficiaries = async () => {
        try {
            setLoading(true);
            const params = {
                page,
                limit: 10,
                search,
                status: statusFilter,
                gender: genderFilter
            };

            const response = await beneficiaryAPI.getAll(params);

            if (response.data.success) {
                setBeneficiaries(response.data.data.beneficiaries);
                setTotalPages(response.data.data.pagination.pages);
            }
            setError('');
        } catch (err) {
            setError('Failed to load beneficiaries');
            console.error('Error fetching beneficiaries:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch statistics
    const fetchStats = async () => {
        try {
            const response = await beneficiaryAPI.getStats();
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    useEffect(() => {
        fetchBeneficiaries();
    }, [page, search, statusFilter, genderFilter]);

    useEffect(() => {
        fetchStats();
    }, []);

    // Handle search
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1); // Reset to first page
    };

    // Handle delete
    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            try {
                await beneficiaryAPI.delete(id);
                fetchBeneficiaries();
                fetchStats();
            } catch (err) {
                alert('Failed to delete beneficiary');
                console.error('Error deleting beneficiary:', err);
            }
        }
    };

    // Calculate age from date of birth
    const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-content">
                <Header />
                <div className="content-area">
                    {/* Page Header */}
                    <div className="page-header">
                        <div>
                            <h1>Beneficiaries</h1>
                            <p>Manage and view all registered beneficiaries</p>
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/beneficiaries/create')}
                        >
                            + Register New Beneficiary
                        </button>
                    </div>

                    {/* Statistics Cards */}
                    {stats && (
                        <div className="stats-grid" style={{ marginBottom: '20px' }}>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: '#3498db' }}>👥</div>
                                <div className="stat-details">
                                    <div className="stat-label">Total Beneficiaries</div>
                                    <div className="stat-value">{stats.total}</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: '#2ecc71' }}>✓</div>
                                <div className="stat-details">
                                    <div className="stat-label">Active</div>
                                    <div className="stat-value">{stats.active}</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: '#e74c3c' }}>✗</div>
                                <div className="stat-details">
                                    <div className="stat-label">Inactive</div>
                                    <div className="stat-value">{stats.inactive}</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: '#9b59b6' }}>📊</div>
                                <div className="stat-details">
                                    <div className="stat-label">Gender Ratio (M/F)</div>
                                    <div className="stat-value">{stats.male}/{stats.female}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Filters Section */}
                    <div className="card" style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '250px' }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by name, ID, phone, or email..."
                                    value={search}
                                    onChange={handleSearch}
                                />
                            </div>
                            <div>
                                <select
                                    className="form-control"
                                    value={statusFilter}
                                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                                >
                                    <option value="">All Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Deceased">Deceased</option>
                                    <option value="Relocated">Relocated</option>
                                </select>
                            </div>
                            <div>
                                <select
                                    className="form-control"
                                    value={genderFilter}
                                    onChange={(e) => { setGenderFilter(e.target.value); setPage(1); }}
                                >
                                    <option value="">All Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <button
                                className="btn btn-secondary"
                                onClick={() => {
                                    setSearch('');
                                    setStatusFilter('');
                                    setGenderFilter('');
                                    setPage(1);
                                }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    {/* Beneficiaries Table */}
                    <div className="card">
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <div className="spinner"></div>
                                <p>Loading beneficiaries...</p>
                            </div>
                        ) : beneficiaries.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
                                <div style={{ fontSize: '48px', marginBottom: '10px' }}>📋</div>
                                <p>No beneficiaries found</p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigate('/beneficiaries/create')}
                                    style={{ marginTop: '10px' }}
                                >
                                    Register First Beneficiary
                                </button>
                            </div>
                        ) : (
                            <>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Reg. Number</th>
                                            <th>Name</th>
                                            <th>Age/Gender</th>
                                            <th>Contact</th>
                                            <th>Location</th>
                                            <th>Status</th>
                                            <th>Registered</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {beneficiaries.map((beneficiary) => (
                                            <tr key={beneficiary.beneficiary_id}>
                                                <td><strong>{beneficiary.registration_number}</strong></td>
                                                <td>
                                                    {beneficiary.first_name} {beneficiary.middle_name} {beneficiary.last_name}
                                                </td>
                                                <td>
                                                    {calculateAge(beneficiary.date_of_birth)} yrs / {beneficiary.gender}
                                                </td>
                                                <td>
                                                    <div>{beneficiary.phone_number || 'N/A'}</div>
                                                    <small style={{ color: '#7f8c8d' }}>{beneficiary.email || 'N/A'}</small>
                                                </td>
                                                <td>{beneficiary.location || 'N/A'}</td>
                                                <td>
                                                    <span className={`badge ${
                                                        beneficiary.status === 'Active' ? 'badge-success' :
                                                        beneficiary.status === 'Inactive' ? 'badge-warning' :
                                                        'badge-danger'
                                                    }`}>
                                                        {beneficiary.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {new Date(beneficiary.registration_date).toLocaleDateString()}
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '5px' }}>
                                                        <button
                                                            className="btn btn-sm btn-info"
                                                            onClick={() => navigate(`/beneficiaries/${beneficiary.beneficiary_id}`)}
                                                            title="View Details"
                                                        >
                                                            👁️
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => navigate(`/beneficiaries/edit/${beneficiary.beneficiary_id}`)}
                                                            title="Edit"
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => handleDelete(
                                                                beneficiary.beneficiary_id,
                                                                `${beneficiary.first_name} ${beneficiary.last_name}`
                                                            )}
                                                            title="Delete"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="pagination">
                                        <button
                                            className="btn btn-secondary"
                                            disabled={page === 1}
                                            onClick={() => setPage(page - 1)}
                                        >
                                            Previous
                                        </button>
                                        <span style={{ padding: '0 20px' }}>
                                            Page {page} of {totalPages}
                                        </span>
                                        <button
                                            className="btn btn-secondary"
                                            disabled={page === totalPages}
                                            onClick={() => setPage(page + 1)}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeneficiaryList;
