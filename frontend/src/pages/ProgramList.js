// =====================================================
// PROGRAM LIST PAGE
// =====================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { programAPI } from '../services/api';
import '../styles/App.css';

const ProgramList = () => {
    const navigate = useNavigate();
    const [programs, setPrograms] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Pagination and filters
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [stats, setStats] = useState(null);

    // Fetch programs
    const fetchPrograms = async () => {
        try {
            setLoading(true);
            const params = {
                page,
                limit: 10,
                search,
                status: statusFilter,
                category_id: categoryFilter
            };

            const response = await programAPI.getAll(params);

            if (response.data.success) {
                setPrograms(response.data.data.programs);
                setTotalPages(response.data.data.pagination.pages);
            }
            setError('');
        } catch (err) {
            setError('Failed to load programs');
            console.error('Error fetching programs:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch statistics
    const fetchStats = async () => {
        try {
            const response = await programAPI.getStats();
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await programAPI.getCategories();
            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    useEffect(() => {
        fetchPrograms();
    }, [page, search, statusFilter, categoryFilter]);

    useEffect(() => {
        fetchStats();
        fetchCategories();
    }, []);

    // Handle search
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    // Handle delete
    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to close the program "${name}"?`)) {
            try {
                await programAPI.delete(id);
                fetchPrograms();
                fetchStats();
            } catch (err) {
                alert('Failed to close program');
                console.error('Error deleting program:', err);
            }
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES'
        }).format(amount || 0);
    };

    // Calculate days remaining
    const getDaysRemaining = (endDate) => {
        if (!endDate) return 'Ongoing';
        const today = new Date();
        const end = new Date(endDate);
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'Ended';
        if (diffDays === 0) return 'Ends Today';
        return `${diffDays} days left`;
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
                            <h1>Programs</h1>
                            <p>Manage and monitor all programs</p>
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/programs/create')}
                        >
                            + Create New Program
                        </button>
                    </div>

                    {/* Statistics Cards */}
                    {stats && (
                        <div className="stats-grid" style={{ marginBottom: '20px' }}>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: '#3498db' }}>📊</div>
                                <div className="stat-details">
                                    <div className="stat-label">Total Programs</div>
                                    <div className="stat-value">{stats.total}</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: '#2ecc71' }}>✓</div>
                                <div className="stat-details">
                                    <div className="stat-label">Active Programs</div>
                                    <div className="stat-value">{stats.active}</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: '#f39c12' }}>📋</div>
                                <div className="stat-details">
                                    <div className="stat-label">Planning</div>
                                    <div className="stat-value">{stats.planning}</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: '#9b59b6' }}>💰</div>
                                <div className="stat-details">
                                    <div className="stat-label">Total Budget</div>
                                    <div className="stat-value" style={{ fontSize: '18px' }}>
                                        {formatCurrency(stats.total_budget)}
                                    </div>
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
                                    placeholder="Search by name, code, or funding source..."
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
                                    <option value="Planning">Planning</option>
                                    <option value="Active">Active</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Suspended">Suspended</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </div>
                            <div>
                                <select
                                    className="form-control"
                                    value={categoryFilter}
                                    onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat.category_id} value={cat.category_id}>
                                            {cat.category_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                className="btn btn-secondary"
                                onClick={() => {
                                    setSearch('');
                                    setStatusFilter('');
                                    setCategoryFilter('');
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

                    {/* Programs Table */}
                    <div className="card">
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <div className="spinner"></div>
                                <p>Loading programs...</p>
                            </div>
                        ) : programs.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
                                <div style={{ fontSize: '48px', marginBottom: '10px' }}>📂</div>
                                <p>No programs found</p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigate('/programs/create')}
                                    style={{ marginTop: '10px' }}
                                >
                                    Create First Program
                                </button>
                            </div>
                        ) : (
                            <>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Code</th>
                                            <th>Program Name</th>
                                            <th>Duration</th>
                                            <th>Budget</th>
                                            <th>Funding Source</th>
                                            <th>Status</th>
                                            <th>Time Remaining</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {programs.map((program) => (
                                            <tr key={program.program_id}>
                                                <td><strong>{program.program_code}</strong></td>
                                                <td>
                                                    <div style={{ fontWeight: '500' }}>{program.program_name}</div>
                                                    {program.description && (
                                                        <small style={{ color: '#7f8c8d' }}>
                                                            {program.description.substring(0, 50)}...
                                                        </small>
                                                    )}
                                                </td>
                                                <td>
                                                    <div>{new Date(program.start_date).toLocaleDateString()}</div>
                                                    <small style={{ color: '#7f8c8d' }}>
                                                        to {program.end_date ? new Date(program.end_date).toLocaleDateString() : 'Ongoing'}
                                                    </small>
                                                </td>
                                                <td>{formatCurrency(program.budget)}</td>
                                                <td>{program.funding_source || 'N/A'}</td>
                                                <td>
                                                    <span className={`badge ${
                                                        program.status === 'Active' ? 'badge-success' :
                                                        program.status === 'Planning' ? 'badge-warning' :
                                                        program.status === 'Completed' ? 'badge-info' :
                                                        'badge-danger'
                                                    }`}>
                                                        {program.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <small>{getDaysRemaining(program.end_date)}</small>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '5px' }}>
                                                        <button
                                                            className="btn btn-sm btn-info"
                                                            onClick={() => navigate(`/programs/${program.program_id}`)}
                                                            title="View Details"
                                                        >
                                                            👁️
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => navigate(`/programs/edit/${program.program_id}`)}
                                                            title="Edit"
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => handleDelete(program.program_id, program.program_name)}
                                                            title="Close"
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

export default ProgramList;
