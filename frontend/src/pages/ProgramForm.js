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
        description: '',
        category_id: '',
        funding_source: '',
        total_budget: '',
        start_date: '',
        end_date: '',
        status: 'Planning',
        target_beneficiaries: '',
        location: '',
        program_manager: '',
        contact_email: '',
        contact_phone: '',
        notes: ''
    });

    // Fetch categories
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch program data if editing
    useEffect(() => {
        if (isEditMode) {
            fetchProgram();
        } else {
            generateProgramCode();
        }
    }, [id]);

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

    const fetchProgram = async () => {
        try {
            setLoading(true);
            const response = await programAPI.getById(id);
            if (response.data.success) {
                const data = response.data.data;
                setFormData({
                    ...data,
                    start_date: data.start_date ? data.start_date.split('T')[0] : '',
                    end_date: data.end_date ? data.end_date.split('T')[0] : '',
                    total_budget: data.total_budget || '',
                    target_beneficiaries: data.target_beneficiaries || ''
                });
            }
        } catch (err) {
            setError('Failed to load program data');
            console.error('Error fetching program:', err);
        } finally {
            setLoading(false);
        }
    };

    const generateProgramCode = () => {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        setFormData(prev => ({
            ...prev,
            program_code: `PRG-${year}-${random}`
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
        setError('');
        setSuccess('');

        // Validation
        if (!formData.program_code || !formData.program_name || !formData.category_id || !formData.start_date) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);

            // Prepare data
            const submitData = {
                ...formData,
                total_budget: formData.total_budget || 0,
                target_beneficiaries: formData.target_beneficiaries || 0
            };

            let response;
            if (isEditMode) {
                response = await programAPI.update(id, submitData);
                setSuccess('Program updated successfully!');
            } else {
                response = await programAPI.create(submitData);
                setSuccess('Program created successfully!');
            }

            setTimeout(() => {
                navigate('/programs');
            }, 1500);

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
                            <p>{isEditMode ? 'Update program information' : 'Register a new program in the system'}</p>
                        </div>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate('/programs')}
                        >
                            ← Back to Programs
                        </button>
                    </div>

                    {/* Messages */}
                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success">
                            {success}
                        </div>
                    )}

                    {/* Form */}
                    <div className="card">
                        <form onSubmit={handleSubmit}>
                            {/* Basic Information */}
                            <div style={{ marginBottom: '30px' }}>
                                <h3 style={{ marginBottom: '20px', borderBottom: '2px solid #3498db', paddingBottom: '10px' }}>
                                    Basic Information
                                </h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">Program Code *</label>
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
                                        <label className="form-label">Program Name *</label>
                                        <input
                                            type="text"
                                            name="program_name"
                                            className="form-control"
                                            value={formData.program_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Category *</label>
                                        <select
                                            name="category_id"
                                            className="form-control"
                                            value={formData.category_id}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat.category_id} value={cat.category_id}>
                                                    {cat.category_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Status</label>
                                        <select
                                            name="status"
                                            className="form-control"
                                            value={formData.status}
                                            onChange={handleChange}
                                        >
                                            <option value="Planning">Planning</option>
                                            <option value="Active">Active</option>
                                            <option value="Completed">Completed</option>
                                            <option value="On Hold">On Hold</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>

                                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                        <label className="form-label">Description</label>
                                        <textarea
                                            name="description"
                                            className="form-control"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="3"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Financial Information */}
                            <div style={{ marginBottom: '30px' }}>
                                <h3 style={{ marginBottom: '20px', borderBottom: '2px solid #2ecc71', paddingBottom: '10px' }}>
                                    Financial Information
                                </h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">Funding Source</label>
                                        <input
                                            type="text"
                                            name="funding_source"
                                            className="form-control"
                                            value={formData.funding_source}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Total Budget ($)</label>
                                        <input
                                            type="number"
                                            name="total_budget"
                                            className="form-control"
                                            value={formData.total_budget}
                                            onChange={handleChange}
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Program Details */}
                            <div style={{ marginBottom: '30px' }}>
                                <h3 style={{ marginBottom: '20px', borderBottom: '2px solid #9b59b6', paddingBottom: '10px' }}>
                                    Program Details
                                </h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">Start Date *</label>
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
                                        <label className="form-label">End Date</label>
                                        <input
                                            type="date"
                                            name="end_date"
                                            className="form-control"
                                            value={formData.end_date}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            className="form-control"
                                            value={formData.location}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Target Beneficiaries</label>
                                        <input
                                            type="number"
                                            name="target_beneficiaries"
                                            className="form-control"
                                            value={formData.target_beneficiaries}
                                            onChange={handleChange}
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div style={{ marginBottom: '30px' }}>
                                <h3 style={{ marginBottom: '20px', borderBottom: '2px solid #f39c12', paddingBottom: '10px' }}>
                                    Contact Information
                                </h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">Program Manager</label>
                                        <input
                                            type="text"
                                            name="program_manager"
                                            className="form-control"
                                            value={formData.program_manager}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Contact Email</label>
                                        <input
                                            type="email"
                                            name="contact_email"
                                            className="form-control"
                                            value={formData.contact_email}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Contact Phone</label>
                                        <input
                                            type="tel"
                                            name="contact_phone"
                                            className="form-control"
                                            value={formData.contact_phone}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                        <label className="form-label">Additional Notes</label>
                                        <textarea
                                            name="notes"
                                            className="form-control"
                                            value={formData.notes}
                                            onChange={handleChange}
                                            rows="3"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #ecf0f1' }}>
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
                                    {loading ? 'Saving...' : isEditMode ? 'Update Program' : 'Create Program'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgramForm;
