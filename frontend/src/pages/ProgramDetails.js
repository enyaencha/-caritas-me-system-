// =====================================================
// PROGRAM DETAILS PAGE
// =====================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { programAPI } from '../services/api';
import '../styles/App.css';

const ProgramDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    // Fetch program details
    const fetchProgram = async () => {
        try {
            setLoading(true);
            const response = await programAPI.getById(id);
            if (response.data.success) {
                setProgram(response.data.data);
            }
        } catch (err) {
            setError('Failed to load program details');
            console.error('Error fetching program:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProgram();
    }, [id]);

    // Calculate budget percentage
    const getBudgetPercentage = () => {
        if (!program || !program.total_budget || program.total_budget === 0) return 0;
        return ((program.budget_utilized / program.total_budget) * 100).toFixed(1);
    };

    // Calculate beneficiary achievement percentage
    const getBeneficiaryPercentage = () => {
        if (!program || !program.target_beneficiaries || program.target_beneficiaries === 0) return 0;
        return ((program.actual_beneficiaries / program.target_beneficiaries) * 100).toFixed(1);
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(amount || 0);
    };

    // Get indicator progress percentage
    const getIndicatorProgress = (indicator) => {
        if (!indicator.target_value || indicator.target_value === 0) return 0;
        return ((indicator.current_value / indicator.target_value) * 100).toFixed(1);
    };

    // Group indicators by type
    const getIndicatorsByType = (type) => {
        if (!program || !program.indicators) return [];
        return program.indicators.filter(ind => ind.indicator_type === type);
    };

    if (loading) {
        return (
            <div className="app-container">
                <Sidebar />
                <div className="main-content">
                    <Header />
                    <div className="content-area">
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <div className="spinner"></div>
                            <p>Loading program details...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !program) {
        return (
            <div className="app-container">
                <Sidebar />
                <div className="main-content">
                    <Header />
                    <div className="content-area">
                        <div className="alert alert-danger">
                            {error || 'Program not found'}
                        </div>
                        <button className="btn btn-secondary" onClick={() => navigate('/programs')}>
                            ← Back to Programs
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-content">
                <Header />
                <div className="content-area">
                    {/* Page Header */}
                    <div className="page-header">
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                                <h1>{program.program_name}</h1>
                                <span className={`badge ${
                                    program.status === 'Active' ? 'badge-success' :
                                    program.status === 'Planning' ? 'badge-info' :
                                    program.status === 'Completed' ? 'badge-secondary' :
                                    program.status === 'On Hold' ? 'badge-warning' :
                                    'badge-danger'
                                }`} style={{ fontSize: '14px', padding: '6px 12px' }}>
                                    {program.status}
                                </span>
                            </div>
                            <p><strong>Code:</strong> {program.program_code}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate(`/programs/edit/${id}`)}
                            >
                                ✏️ Edit Program
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => navigate('/programs')}
                            >
                                ← Back
                            </button>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="stats-grid" style={{ marginBottom: '20px' }}>
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: '#3498db' }}>💰</div>
                            <div className="stat-details">
                                <div className="stat-label">Total Budget</div>
                                <div className="stat-value">{formatCurrency(program.total_budget)}</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: '#e74c3c' }}>💸</div>
                            <div className="stat-details">
                                <div className="stat-label">Budget Utilized</div>
                                <div className="stat-value">{formatCurrency(program.budget_utilized)}</div>
                                <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                                    {getBudgetPercentage()}% of budget
                                </div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: '#2ecc71' }}>💵</div>
                            <div className="stat-details">
                                <div className="stat-label">Budget Remaining</div>
                                <div className="stat-value">{formatCurrency(program.budget_remaining)}</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: '#9b59b6' }}>👥</div>
                            <div className="stat-details">
                                <div className="stat-label">Beneficiaries</div>
                                <div className="stat-value">
                                    {program.actual_beneficiaries} / {program.target_beneficiaries}
                                </div>
                                <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                                    {getBeneficiaryPercentage()}% reached
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="card" style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #ecf0f1' }}>
                            <button
                                className={activeTab === 'overview' ? 'tab-active' : 'tab-inactive'}
                                onClick={() => setActiveTab('overview')}
                                style={{
                                    padding: '12px 24px',
                                    border: 'none',
                                    background: activeTab === 'overview' ? '#3498db' : 'transparent',
                                    color: activeTab === 'overview' ? 'white' : '#7f8c8d',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    borderRadius: '4px 4px 0 0'
                                }}
                            >
                                Overview
                            </button>
                            <button
                                className={activeTab === 'indicators' ? 'tab-active' : 'tab-inactive'}
                                onClick={() => setActiveTab('indicators')}
                                style={{
                                    padding: '12px 24px',
                                    border: 'none',
                                    background: activeTab === 'indicators' ? '#3498db' : 'transparent',
                                    color: activeTab === 'indicators' ? 'white' : '#7f8c8d',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    borderRadius: '4px 4px 0 0'
                                }}
                            >
                                Indicators ({program.indicators?.length || 0})
                            </button>
                            <button
                                className={activeTab === 'budget' ? 'tab-active' : 'tab-inactive'}
                                onClick={() => setActiveTab('budget')}
                                style={{
                                    padding: '12px 24px',
                                    border: 'none',
                                    background: activeTab === 'budget' ? '#3498db' : 'transparent',
                                    color: activeTab === 'budget' ? 'white' : '#7f8c8d',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    borderRadius: '4px 4px 0 0'
                                }}
                            >
                                Budget
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'overview' && (
                        <div className="card">
                            <h3 style={{ marginBottom: '20px' }}>Program Overview</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                                <div>
                                    <h4 style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '10px' }}>CATEGORY</h4>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '6px 12px',
                                        borderRadius: '4px',
                                        backgroundColor: program.category?.color + '20',
                                        color: program.category?.color,
                                        fontWeight: '600'
                                    }}>
                                        {program.category?.category_name || 'N/A'}
                                    </span>
                                </div>
                                <div>
                                    <h4 style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '10px' }}>FUNDING SOURCE</h4>
                                    <p style={{ fontWeight: '600' }}>{program.funding_source || 'N/A'}</p>
                                </div>
                                <div>
                                    <h4 style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '10px' }}>LOCATION</h4>
                                    <p style={{ fontWeight: '600' }}>{program.location || 'N/A'}</p>
                                </div>
                                <div>
                                    <h4 style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '10px' }}>PROGRAM MANAGER</h4>
                                    <p style={{ fontWeight: '600' }}>{program.program_manager || 'N/A'}</p>
                                </div>
                                <div>
                                    <h4 style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '10px' }}>START DATE</h4>
                                    <p style={{ fontWeight: '600' }}>{new Date(program.start_date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <h4 style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '10px' }}>END DATE</h4>
                                    <p style={{ fontWeight: '600' }}>
                                        {program.end_date ? new Date(program.end_date).toLocaleDateString() : 'Ongoing'}
                                    </p>
                                </div>
                            </div>

                            {program.description && (
                                <>
                                    <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #ecf0f1' }} />
                                    <div>
                                        <h4 style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '10px' }}>DESCRIPTION</h4>
                                        <p>{program.description}</p>
                                    </div>
                                </>
                            )}

                            {program.notes && (
                                <>
                                    <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #ecf0f1' }} />
                                    <div>
                                        <h4 style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '10px' }}>NOTES</h4>
                                        <p>{program.notes}</p>
                                    </div>
                                </>
                            )}

                            <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #ecf0f1' }} />
                            <div>
                                <h4 style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '10px' }}>CONTACT</h4>
                                <p>
                                    <strong>Email:</strong> {program.contact_email || 'N/A'}<br />
                                    <strong>Phone:</strong> {program.contact_phone || 'N/A'}
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'indicators' && (
                        <div>
                            {['Input', 'Output', 'Outcome', 'Impact'].map(type => {
                                const indicators = getIndicatorsByType(type);
                                if (indicators.length === 0) return null;

                                return (
                                    <div key={type} className="card" style={{ marginBottom: '20px' }}>
                                        <h3 style={{
                                            marginBottom: '20px',
                                            color: type === 'Input' ? '#3498db' :
                                                  type === 'Output' ? '#2ecc71' :
                                                  type === 'Outcome' ? '#f39c12' : '#9b59b6'
                                        }}>
                                            {type} Indicators ({indicators.length})
                                        </h3>
                                        <div style={{ display: 'grid', gap: '15px' }}>
                                            {indicators.map(indicator => (
                                                <div
                                                    key={indicator.indicator_id}
                                                    style={{
                                                        padding: '15px',
                                                        border: '1px solid #ecf0f1',
                                                        borderRadius: '8px',
                                                        background: '#f8f9fa'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                                                        <div style={{ flex: 1 }}>
                                                            <h4 style={{ marginBottom: '5px' }}>{indicator.indicator_name}</h4>
                                                            {indicator.description && (
                                                                <p style={{ fontSize: '13px', color: '#7f8c8d', marginBottom: '10px' }}>
                                                                    {indicator.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <span className={`badge ${
                                                            indicator.status === 'On Track' ? 'badge-success' :
                                                            indicator.status === 'Behind' ? 'badge-warning' :
                                                            indicator.status === 'At Risk' ? 'badge-danger' :
                                                            'badge-info'
                                                        }`}>
                                                            {indicator.status}
                                                        </span>
                                                    </div>

                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '15px' }}>
                                                        <div>
                                                            <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Baseline</div>
                                                            <div style={{ fontWeight: '600' }}>
                                                                {indicator.baseline_value} {indicator.unit_of_measure}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Current</div>
                                                            <div style={{ fontWeight: '600', color: '#2ecc71' }}>
                                                                {indicator.current_value} {indicator.unit_of_measure}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Target</div>
                                                            <div style={{ fontWeight: '600', color: '#3498db' }}>
                                                                {indicator.target_value} {indicator.unit_of_measure}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Collection Frequency</div>
                                                            <div style={{ fontWeight: '600' }}>{indicator.collection_frequency}</div>
                                                        </div>
                                                    </div>

                                                    {/* Progress Bar */}
                                                    <div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                            <span style={{ fontSize: '12px', color: '#7f8c8d' }}>Progress</span>
                                                            <span style={{ fontSize: '12px', fontWeight: '600' }}>
                                                                {getIndicatorProgress(indicator)}%
                                                            </span>
                                                        </div>
                                                        <div style={{
                                                            width: '100%',
                                                            backgroundColor: '#ecf0f1',
                                                            borderRadius: '8px',
                                                            height: '12px',
                                                            overflow: 'hidden'
                                                        }}>
                                                            <div style={{
                                                                width: `${Math.min(getIndicatorProgress(indicator), 100)}%`,
                                                                backgroundColor:
                                                                    indicator.status === 'On Track' ? '#2ecc71' :
                                                                    indicator.status === 'Behind' ? '#f39c12' :
                                                                    indicator.status === 'At Risk' ? '#e74c3c' : '#3498db',
                                                                height: '100%',
                                                                transition: 'width 0.3s ease'
                                                            }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}

                            {(!program.indicators || program.indicators.length === 0) && (
                                <div className="card">
                                    <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
                                        <div style={{ fontSize: '48px', marginBottom: '10px' }}>📊</div>
                                        <p>No indicators added yet</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'budget' && (
                        <div className="card">
                            <h3 style={{ marginBottom: '20px' }}>Budget Overview</h3>

                            {/* Budget Progress */}
                            <div style={{ marginBottom: '30px' }}>
                                <h4 style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '15px' }}>BUDGET UTILIZATION</h4>
                                <div style={{
                                    width: '100%',
                                    backgroundColor: '#ecf0f1',
                                    borderRadius: '12px',
                                    height: '40px',
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        width: `${Math.min(getBudgetPercentage(), 100)}%`,
                                        backgroundColor:
                                            getBudgetPercentage() > 90 ? '#e74c3c' :
                                            getBudgetPercentage() > 75 ? '#f39c12' : '#2ecc71',
                                        height: '100%',
                                        transition: 'width 0.3s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: '600'
                                    }}>
                                        {getBudgetPercentage()}%
                                    </div>
                                </div>
                            </div>

                            {/* Budget Breakdown */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                                <div style={{
                                    padding: '20px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    borderRadius: '12px',
                                    color: 'white'
                                }}>
                                    <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '10px' }}>Total Budget</div>
                                    <div style={{ fontSize: '32px', fontWeight: '700' }}>
                                        {formatCurrency(program.total_budget)}
                                    </div>
                                </div>

                                <div style={{
                                    padding: '20px',
                                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                    borderRadius: '12px',
                                    color: 'white'
                                }}>
                                    <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '10px' }}>Budget Utilized</div>
                                    <div style={{ fontSize: '32px', fontWeight: '700' }}>
                                        {formatCurrency(program.budget_utilized)}
                                    </div>
                                    <div style={{ fontSize: '14px', opacity: 0.9, marginTop: '5px' }}>
                                        {getBudgetPercentage()}% of total
                                    </div>
                                </div>

                                <div style={{
                                    padding: '20px',
                                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                    borderRadius: '12px',
                                    color: 'white'
                                }}>
                                    <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '10px' }}>Budget Remaining</div>
                                    <div style={{ fontSize: '32px', fontWeight: '700' }}>
                                        {formatCurrency(program.budget_remaining)}
                                    </div>
                                    <div style={{ fontSize: '14px', opacity: 0.9, marginTop: '5px' }}>
                                        {(100 - getBudgetPercentage()).toFixed(1)}% remaining
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProgramDetails;
