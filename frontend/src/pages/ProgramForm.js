// =====================================================
// PROGRAM FORM PAGE (Create/Edit)
// =====================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { programAPI } from '../services/api';
import '../styles/App.css';

const ProgramForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        program_code: '',
        program_name: '',
        category_id: '',
        description: '',
        start_date: '',
        end_date: '',
        budget: '',
        funding_source: '',
        program_manager: '',
        status: 'Planning'
    });

    // Fetch program data if editing
    useEffect(() => {
        if (isEditMode) {
            fetchProgram();
        } else {
            generateProgramCode();
        }
        fetchCategories();
    }, [id]);

    const fetchProgram = async () => {
        try {
            setLoading(true);
            const response = await programAPI.getById(id);
            if (response.data.success) {
                const data = response.data.data.program;
                setFormData({
                    ...data,
                    start_date: data.start_date ? data.start_date.split('T')[0] : '',
                    end_date: data.end_date ? data.end_date.split('T')[0] : '',
                    category_id: data.category_id || '',
                    program_manager: data.program_manager || ''
                });
            }
        } catch (err) {
            setError('Failed to load program data');
            console.error('Error fetching program:', err);
        } finally {
            setLoading(false);
        }
    };

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

    const generateProgramCode = () => {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        setFormData(prev => ({
            ...prev,
            program_code: `PROG-${year}-${random}`
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            let response;
            if (isEditMode) {
                response = await programAPI.update(id, formData);
            } else {
                response = await programAPI.create(formData);
            }

            if (response.data.success) {
                setSuccess(isEditMode ? 'Program updated successfully!' : 'Program created successfully!');
                setTimeout(() => {
                    navigate('/programs');
                }, 1500);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save program');
            console.error('Error saving program:', err);
        } finally {
            setLoading(false);
        }
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
                            <h1>{isEditMode ? 'Edit Program' : 'Create New Program'}</h1>
                            <p>{isEditMode ? 'Update program information' : 'Add a new program to the system'}</p>
                        </div>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate('/programs')}
                        >
                            ← Back to List
                        </button>
                    </div>

                    {/* Success/Error Messages */}
                    {success && (
                        <div className="alert alert-success">
                            {success}
                        </div>
                    )}
                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        {/* Basic Information */}
                        <div className="card" style={{ marginBottom: '20px' }}>
                            <h3>Basic Information</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Program Code *</label>
                                    <input
                                        type="text"
                                        name="program_code"
                                        className="form-control"
                                        value={formData.program_code}
                                        onChange={handleChange}
                                        required
                                        readOnly={isEditMode}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Program Name *</label>
                                    <input
                                        type="text"
                                        name="program_name"
                                        className="form-control"
                                        value={formData.program_name}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., Food Distribution Program"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        name="category_id"
                                        className="form-control"
                                        value={formData.category_id}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.category_id} value={cat.category_id}>
                                                {cat.category_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>Description</label>
                                    <textarea
                                        name="description"
                                        className="form-control"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Describe the program objectives, target audience, and expected outcomes..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="card" style={{ marginBottom: '20px' }}>
                            <h3>Program Timeline</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Start Date *</label>
                                    <input
                                        type="date"
                                        name="start_date"
                                        className="form-control"
                                        value={formData.start_date}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>End Date</label>
                                    <input
                                        type="date"
                                        name="end_date"
                                        className="form-control"
                                        value={formData.end_date}
                                        onChange={handleChange}
                                    />
                                    <small style={{ color: '#7f8c8d' }}>Leave blank for ongoing programs</small>
                                </div>
                                <div className="form-group">
                                    <label>Status *</label>
                                    <select
                                        name="status"
                                        className="form-control"
                                        value={formData.status}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="Planning">Planning</option>
                                        <option value="Active">Active</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Suspended">Suspended</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Budget & Funding */}
                        <div className="card" style={{ marginBottom: '20px' }}>
                            <h3>Budget & Funding</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Total Budget (KES)</label>
                                    <input
                                        type="number"
                                        name="budget"
                                        className="form-control"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Funding Source</label>
                                    <input
                                        type="text"
                                        name="funding_source"
                                        className="form-control"
                                        value={formData.funding_source}
                                        onChange={handleChange}
                                        placeholder="e.g., USAID, World Bank, Internal"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="card">
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => navigate('/programs')}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : (isEditMode ? 'Update Program' : 'Create Program')}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProgramForm;
