// =====================================================
// BENEFICIARY FORM PAGE (Create/Edit)
// =====================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { beneficiaryAPI } from '../services/api';
import '../styles/App.css';

const BeneficiaryForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [photoPreview, setPhotoPreview] = useState(null);
    const [photoFile, setPhotoFile] = useState(null);

    const [formData, setFormData] = useState({
        registration_number: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        national_id: '',
        phone_number: '',
        email: '',
        marital_status: '',
        education_level: '',
        occupation: '',
        disability_status: '',
        household_size: '',
        monthly_income: '',
        registration_date: new Date().toISOString().split('T')[0],
        status: 'Active'
    });

    // Fetch beneficiary data if editing
    useEffect(() => {
        if (isEditMode) {
            fetchBeneficiary();
        } else {
            // Generate registration number for new beneficiary
            generateRegistrationNumber();
        }
    }, [id]);

    const fetchBeneficiary = async () => {
        try {
            setLoading(true);
            const response = await beneficiaryAPI.getById(id);
            if (response.data.success) {
                const data = response.data.data;
                setFormData({
                    ...data,
                    date_of_birth: data.date_of_birth ? data.date_of_birth.split('T')[0] : '',
                    registration_date: data.registration_date ? data.registration_date.split('T')[0] : ''
                });
                if (data.photo) {
                    setPhotoPreview(`http://localhost:5000${data.photo}`);
                }
            }
        } catch (err) {
            setError('Failed to load beneficiary data');
            console.error('Error fetching beneficiary:', err);
        } finally {
            setLoading(false);
        }
    };

    const generateRegistrationNumber = () => {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        setFormData(prev => ({
            ...prev,
            registration_number: `BEN-${year}-${random}`
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('Photo size must be less than 5MB');
                return;
            }
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            let response;
            if (isEditMode) {
                response = await beneficiaryAPI.update(id, formData);
            } else {
                response = await beneficiaryAPI.create(formData);
            }

            if (response.data.success) {
                const beneficiaryId = isEditMode ? id : response.data.data.beneficiary_id;

                // Upload photo if selected
                if (photoFile) {
                    const photoFormData = new FormData();
                    photoFormData.append('photo', photoFile);
                    await beneficiaryAPI.uploadPhoto(beneficiaryId, photoFormData);
                }

                setSuccess(isEditMode ? 'Beneficiary updated successfully!' : 'Beneficiary registered successfully!');
                setTimeout(() => {
                    navigate('/beneficiaries');
                }, 1500);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save beneficiary');
            console.error('Error saving beneficiary:', err);
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
                            <h1>{isEditMode ? 'Edit Beneficiary' : 'Register New Beneficiary'}</h1>
                            <p>{isEditMode ? 'Update beneficiary information' : 'Add a new beneficiary to the system'}</p>
                        </div>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate('/beneficiaries')}
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
                                    <label>Registration Number *</label>
                                    <input
                                        type="text"
                                        name="registration_number"
                                        className="form-control"
                                        value={formData.registration_number}
                                        onChange={handleChange}
                                        required
                                        readOnly={isEditMode}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Registration Date *</label>
                                    <input
                                        type="date"
                                        name="registration_date"
                                        className="form-control"
                                        value={formData.registration_date}
                                        onChange={handleChange}
                                        required
                                    />
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
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Deceased">Deceased</option>
                                        <option value="Relocated">Relocated</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="card" style={{ marginBottom: '20px' }}>
                            <h3>Personal Information</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name *</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        className="form-control"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Middle Name</label>
                                    <input
                                        type="text"
                                        name="middle_name"
                                        className="form-control"
                                        value={formData.middle_name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name *</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        className="form-control"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date of Birth *</label>
                                    <input
                                        type="date"
                                        name="date_of_birth"
                                        className="form-control"
                                        value={formData.date_of_birth}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Gender *</label>
                                    <select
                                        name="gender"
                                        className="form-control"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>National ID</label>
                                    <input
                                        type="text"
                                        name="national_id"
                                        className="form-control"
                                        value={formData.national_id}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Marital Status</label>
                                    <select
                                        name="marital_status"
                                        className="form-control"
                                        value={formData.marital_status}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Divorced">Divorced</option>
                                        <option value="Widowed">Widowed</option>
                                        <option value="Separated">Separated</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Education Level</label>
                                    <input
                                        type="text"
                                        name="education_level"
                                        className="form-control"
                                        value={formData.education_level}
                                        onChange={handleChange}
                                        placeholder="e.g., Primary, Secondary, University"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Occupation</label>
                                    <input
                                        type="text"
                                        name="occupation"
                                        className="form-control"
                                        value={formData.occupation}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="card" style={{ marginBottom: '20px' }}>
                            <h3>Contact Information</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone_number"
                                        className="form-control"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        placeholder="+254..."
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Household & Economic Information */}
                        <div className="card" style={{ marginBottom: '20px' }}>
                            <h3>Household & Economic Information</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Household Size</label>
                                    <input
                                        type="number"
                                        name="household_size"
                                        className="form-control"
                                        value={formData.household_size}
                                        onChange={handleChange}
                                        min="1"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Monthly Income (KES)</label>
                                    <input
                                        type="number"
                                        name="monthly_income"
                                        className="form-control"
                                        value={formData.monthly_income}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Disability Status</label>
                                    <input
                                        type="text"
                                        name="disability_status"
                                        className="form-control"
                                        value={formData.disability_status}
                                        onChange={handleChange}
                                        placeholder="None, Physical, Visual, etc."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Photo Upload */}
                        <div className="card" style={{ marginBottom: '20px' }}>
                            <h3>Photo</h3>
                            <div className="form-row">
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Upload Photo</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                    />
                                    <small style={{ color: '#7f8c8d' }}>
                                        Max file size: 5MB. Supported formats: JPG, PNG, GIF
                                    </small>
                                </div>
                                {photoPreview && (
                                    <div style={{ marginLeft: '20px' }}>
                                        <label>Preview</label>
                                        <div>
                                            <img
                                                src={photoPreview}
                                                alt="Preview"
                                                style={{
                                                    width: '150px',
                                                    height: '150px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    border: '2px solid #ddd'
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="card">
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => navigate('/beneficiaries')}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : (isEditMode ? 'Update Beneficiary' : 'Register Beneficiary')}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BeneficiaryForm;
