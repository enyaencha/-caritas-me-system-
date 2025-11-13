// =====================================================
// PROGRAM MODULES OVERVIEW
// =====================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { programAPI } from '../services/api';
import '../styles/App.css';

const ProgramList = () => {
    const navigate = useNavigate();
    const [categoryStats, setCategoryStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters
    const [statusFilter, setStatusFilter] = useState('');
    const [sortBy, setSortBy] = useState('beneficiaries');
    const [yearFilter, setYearFilter] = useState('');

    // Fetch category statistics
    const fetchCategoryStats = async () => {
        try {
            setLoading(true);
            const params = {};
            if (statusFilter) params.status = statusFilter;
            if (yearFilter) params.year = yearFilter;

            const response = await programAPI.getCategoryStats(params);

            if (response.data.success) {
                let stats = response.data.data;

                // Apply sorting
                if (sortBy === 'beneficiaries') {
                    stats = stats.sort((a, b) => b.total_beneficiaries - a.total_beneficiaries);
                } else if (sortBy === 'latest') {
                    // Keep original order or sort by category name
                    stats = stats.sort((a, b) => a.category_name.localeCompare(b.category_name));
                } else if (sortBy === 'alphabetical') {
                    stats = stats.sort((a, b) => a.category_name.localeCompare(b.category_name));
                }

                setCategoryStats(stats);
            }
            setError('');
        } catch (err) {
            setError('Failed to load program statistics');
            console.error('Error fetching category stats:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoryStats();
    }, [statusFilter, sortBy, yearFilter]);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    // Format number
    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-US').format(num || 0);
    };

    // Get icon emoji for category
    const getCategoryIcon = (categoryName) => {
        const icons = {
            'Food, Water & Environment': '🌾',
            'Food & Environment': '🌾',
            'Socio-Economic Empowerment': '💼',
            'Socio-Economic': '💼',
            'Gender, Youth & Peace': '👥',
            'Gender & Youth': '👥',
            'Relief & Charitable Services': '🏥',
            'Relief Services': '🏥',
            'Capacity Building': '🎓',
            'Peace Building & Cohesion': '🕊️'
        };
        return icons[categoryName] || '📁';
    };

    // Handle card click - navigate to program detail view for that category
    const handleCardClick = (category) => {
        // For now, navigate to a filtered programs list or category detail
        navigate(`/programs/category/${category.category_id}`);
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
                            <h1>Program Modules</h1>
                            <p className="breadcrumb">Home &gt; Programs</p>
                        </div>
                    </div>

                    {/* Filters Panel */}
                    <div className="filters-panel">
                        <div className="filter-group">
                            <div className="form-field">
                                <label>Filter by Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="form-control"
                                >
                                    <option value="">All Programs</option>
                                    <option value="Active">Active</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Planning">Planning</option>
                                    <option value="On Hold">On Hold</option>
                                </select>
                            </div>
                            <div className="form-field">
                                <label>Sort by</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="form-control"
                                >
                                    <option value="beneficiaries">Most Beneficiaries</option>
                                    <option value="latest">Latest</option>
                                    <option value="alphabetical">Alphabetical</option>
                                </select>
                            </div>
                            <div className="form-field">
                                <label>Year</label>
                                <select
                                    value={yearFilter}
                                    onChange={(e) => setYearFilter(e.target.value)}
                                    className="form-control"
                                >
                                    <option value="">All Years</option>
                                    <option value="2025">2025</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                    <option value="2022">2022</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    {/* Loading State */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <div className="spinner"></div>
                            <p>Loading program modules...</p>
                        </div>
                    ) : (
                        <>
                            {/* Program Category Cards Grid */}
                            <div className="program-grid">
                                {categoryStats.length === 0 ? (
                                    <div className="card" style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>
                                        <p style={{ color: '#7f8c8d' }}>No program modules found matching the selected filters.</p>
                                    </div>
                                ) : (
                                    categoryStats.map((category) => (
                                        <div
                                            key={category.category_id}
                                            className="program-card"
                                            onClick={() => handleCardClick(category)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {/* Icon */}
                                            <div
                                                className="program-icon"
                                                style={{
                                                    backgroundColor: category.color || '#3498db',
                                                    color: 'white'
                                                }}
                                            >
                                                {getCategoryIcon(category.category_name)}
                                            </div>

                                            {/* Title */}
                                            <div className="program-title">
                                                {category.category_name}
                                            </div>

                                            {/* Description */}
                                            <div className="program-description">
                                                {category.description || 'No description available'}
                                            </div>

                                            {/* Stats */}
                                            <div className="program-stats">
                                                <div className="program-stat">
                                                    <div className="program-stat-value">
                                                        {formatNumber(category.total_beneficiaries)}
                                                    </div>
                                                    <div className="program-stat-label">Beneficiaries</div>
                                                </div>
                                                <div className="program-stat">
                                                    <div className="program-stat-value">
                                                        {category.total_programs}
                                                    </div>
                                                    <div className="program-stat-label">Projects</div>
                                                </div>
                                                <div className="program-stat">
                                                    <div className="program-stat-value">
                                                        {formatCurrency(category.total_budget).replace('KES', 'KES ')}
                                                    </div>
                                                    <div className="program-stat-label">Budget</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProgramList;
