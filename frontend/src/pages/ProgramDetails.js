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
    const [indicators, setIndicators] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddIndicator, setShowAddIndicator] = useState(false);
    const [indicatorForm, setIndicatorForm] = useState({
        indicator_code: '',
        indicator_name: '',
        indicator_type: 'Output',
        measurement_unit: '',
        baseline_value: '',
        target_value: '',
        data_source: '',
        frequency: 'Monthly'
    });

    useEffect(() => {
        fetchProgram();
    }, [id]);

    const fetchProgram = async () => {
        try {
            setLoading(true);
            const response = await programAPI.getById(id);
            if (response.data.success) {
                setProgram(response.data.data.program);
                setIndicators(response.data.data.indicators || []);
                setStats(response.data.data.stats || {});
            }
        } catch (err) {
            setError('Failed to load program details');
            console.error('Error fetching program:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to close this program?')) {
            try {
                await programAPI.delete(id);
                navigate('/programs');
            } catch (err) {
                alert('Failed to close program');
                console.error('Error deleting program:', err);
            }
        }
    };

    const handleAddIndicator = async (e) => {
        e.preventDefault();
        try {
            await programAPI.addIndicator(id, indicatorForm);
            setShowAddIndicator(false);
            setIndicatorForm({
                indicator_code: '',
                indicator_name: '',
                indicator_type: 'Output',
                measurement_unit: '',
                baseline_value: '',
                target_value: '',
                data_source: '',
                frequency: 'Monthly'
            });
            fetchProgram();
        } catch (err) {
            alert('Failed to add indicator');
            console.error('Error adding indicator:', err);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES'
        }).format(amount || 0);
    };

    const calculateProgress = (current, target) => {
        if (!target || target === 0) return 0;
        return Math.min(100, ((current / target) * 100).toFixed(1));
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
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate('/programs')}
                        >
                            ← Back to List
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
                            <h1>{program.program_name}</h1>
                            <p style={{ color: '#7f8c8d' }}>{program.program_code}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                className="btn btn-secondary"
                                onClick={() => navigate('/programs')}
                            >
                                ← Back
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate(`/programs/edit/${id}`)}
                            >
                                ✏️ Edit
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleDelete}
                            >
                                🗑️ Close
                            </button>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div style={{ marginBottom: '20px' }}>
                        <span className={`badge ${
                            program.status === 'Active' ? 'badge-success' :
                            program.status === 'Planning' ? 'badge-warning' :
                            program.status === 'Completed' ? 'badge-info' :
                            'badge-danger'
                        }`} style={{ fontSize: '14px', padding: '8px 16px' }}>
                            {program.status}
                        </span>
                    </div>

                    {/* Key Statistics */}
                    <div className="stats-grid" style={{ marginBottom: '20px' }}>
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: '#3498db' }}>📊</div>
                            <div className="stat-details">
                                <div className="stat-label">Total Activities</div>
                                <div className="stat-value">{stats?.total_activities || 0}</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: '#2ecc71' }}>✓</div>
                            <div className="stat-details">
                                <div className="stat-label">Completed</div>
                                <div className="stat-value">{stats?.completed_activities || 0}</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: '#9b59b6' }}>👥</div>
                            <div className="stat-details">
                                <div className="stat-label">Beneficiaries Served</div>
                                <div className="stat-value">{stats?.total_beneficiaries || 0}</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: '#e67e22' }}>💰</div>
                            <div className="stat-details">
                                <div className="stat-label">Budget Utilization</div>
                                <div className="stat-value">{stats?.budget_utilization || 0}%</div>
                            </div>
                        </div>
                    </div>

                    {/* Program Information */}
                    <div className="card" style={{ marginBottom: '20px' }}>
                        <h3>Program Information</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ fontWeight: 'bold', color: '#7f8c8d', fontSize: '12px' }}>Description</label>
                                <p>{program.description || 'No description provided'}</p>
                            </div>
                            <div>
                                <label style={{ fontWeight: 'bold', color: '#7f8c8d', fontSize: '12px' }}>Duration</label>
                                <p>
                                    {new Date(program.start_date).toLocaleDateString()} -
                                    {program.end_date ? new Date(program.end_date).toLocaleDateString() : 'Ongoing'}
                                </p>
                            </div>
                            <div>
                                <label style={{ fontWeight: 'bold', color: '#7f8c8d', fontSize: '12px' }}>Total Budget</label>
                                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#2ecc71' }}>
                                    {formatCurrency(program.budget)}
                                </p>
                            </div>
                            <div>
                                <label style={{ fontWeight: 'bold', color: '#7f8c8d', fontSize: '12px' }}>Spent</label>
                                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#e74c3c' }}>
                                    {formatCurrency(stats?.total_spent)}
                                </p>
                            </div>
                            <div>
                                <label style={{ fontWeight: 'bold', color: '#7f8c8d', fontSize: '12px' }}>Funding Source</label>
                                <p>{program.funding_source || 'Not specified'}</p>
                            </div>
                            <div>
                                <label style={{ fontWeight: 'bold', color: '#7f8c8d', fontSize: '12px' }}>Created</label>
                                <p>{new Date(program.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Program Indicators */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3>Program Indicators</h3>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => setShowAddIndicator(!showAddIndicator)}
                            >
                                {showAddIndicator ? 'Cancel' : '+ Add Indicator'}
                            </button>
                        </div>

                        {/* Add Indicator Form */}
                        {showAddIndicator && (
                            <form onSubmit={handleAddIndicator} style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Indicator Code *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={indicatorForm.indicator_code}
                                            onChange={(e) => setIndicatorForm({...indicatorForm, indicator_code: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Indicator Name *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={indicatorForm.indicator_name}
                                            onChange={(e) => setIndicatorForm({...indicatorForm, indicator_name: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Type *</label>
                                        <select
                                            className="form-control"
                                            value={indicatorForm.indicator_type}
                                            onChange={(e) => setIndicatorForm({...indicatorForm, indicator_type: e.target.value})}
                                        >
                                            <option value="Input">Input</option>
                                            <option value="Output">Output</option>
                                            <option value="Outcome">Outcome</option>
                                            <option value="Impact">Impact</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Measurement Unit</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={indicatorForm.measurement_unit}
                                            onChange={(e) => setIndicatorForm({...indicatorForm, measurement_unit: e.target.value})}
                                            placeholder="e.g., People, Meals, Sessions"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Baseline Value</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={indicatorForm.baseline_value}
                                            onChange={(e) => setIndicatorForm({...indicatorForm, baseline_value: e.target.value})}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Target Value *</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={indicatorForm.target_value}
                                            onChange={(e) => setIndicatorForm({...indicatorForm, target_value: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddIndicator(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary btn-sm">
                                        Add Indicator
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Indicators List */}
                        {indicators.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
                                <div style={{ fontSize: '48px', marginBottom: '10px' }}>📈</div>
                                <p>No indicators added yet</p>
                            </div>
                        ) : (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Code</th>
                                        <th>Indicator Name</th>
                                        <th>Type</th>
                                        <th>Baseline</th>
                                        <th>Target</th>
                                        <th>Current</th>
                                        <th>Progress</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {indicators.map((indicator) => {
                                        const progress = calculateProgress(indicator.current_value, indicator.target_value);
                                        return (
                                            <tr key={indicator.indicator_id}>
                                                <td><strong>{indicator.indicator_code}</strong></td>
                                                <td>{indicator.indicator_name}</td>
                                                <td>
                                                    <span className={`badge ${
                                                        indicator.indicator_type === 'Input' ? 'badge-secondary' :
                                                        indicator.indicator_type === 'Output' ? 'badge-primary' :
                                                        indicator.indicator_type === 'Outcome' ? 'badge-success' :
                                                        'badge-info'
                                                    }`}>
                                                        {indicator.indicator_type}
                                                    </span>
                                                </td>
                                                <td>{indicator.baseline_value || 0} {indicator.measurement_unit}</td>
                                                <td>{indicator.target_value} {indicator.measurement_unit}</td>
                                                <td>{indicator.current_value || 0} {indicator.measurement_unit}</td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={{
                                                            flex: 1,
                                                            height: '20px',
                                                            background: '#ecf0f1',
                                                            borderRadius: '10px',
                                                            overflow: 'hidden'
                                                        }}>
                                                            <div style={{
                                                                width: `${progress}%`,
                                                                height: '100%',
                                                                background: progress >= 75 ? '#2ecc71' : progress >= 50 ? '#f39c12' : '#e74c3c',
                                                                transition: 'width 0.3s'
                                                            }}></div>
                                                        </div>
                                                        <span style={{ minWidth: '50px', textAlign: 'right' }}>{progress}%</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgramDetails;
