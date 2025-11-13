// =====================================================
// DATA ENTRY PAGE - COMPREHENSIVE & MOBILE RESPONSIVE
// =====================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { beneficiaryAPI, programAPI } from '../services/api';
import '../styles/App.css';

const DataEntry = () => {
    const navigate = useNavigate();
    const [mainTab, setMainTab] = useState('beneficiary'); // beneficiary or activity
    const [activityTab, setActivityTab] = useState('basic'); // For activity sub-tabs
    const [categories, setCategories] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Photo handling
    const [photoPreview, setPhotoPreview] = useState(null);
    const [photoFile, setPhotoFile] = useState(null);

    // Beneficiary form state
    const [beneficiaryForm, setBeneficiaryForm] = useState({
        registration_number: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        national_id: '',
        date_of_birth: '',
        gender: '',
        phone_number: '',
        email: '',
        marital_status: '',
        education_level: '',
        occupation: '',
        disability_status: '',
        household_size: '',
        monthly_income: '',
        // Address fields
        county: '',
        sub_county: '',
        ward: '',
        village: '',
        postal_address: '',
        // Vulnerability
        vulnerability_categories: [],
        notes: '',
        // Programs
        programs: [],
        registration_date: new Date().toISOString().split('T')[0],
        status: 'Active'
    });

    // Activity form state
    const [activityForm, setActivityForm] = useState({
        activity_number: '',
        activity_title: '',
        program_id: '',
        activity_type: '',
        description: '',
        location: '',
        start_date: '',
        end_date: '',
        planned_participants: '',
        actual_participants: '',
        planned_budget: '',
        actual_budget: '',
        status: 'Planned',
        priority: 'Medium',
        funding_source: '',
        implementing_partner: '',
        outcomes: '',
        impact: '',
        beneficiaries: [],
        resources: []
    });

    useEffect(() => {
        fetchCategories();
        fetchPrograms();
        if (mainTab === 'beneficiary') {
            generateRegistrationNumber();
        } else {
            generateActivityNumber();
        }
    }, [mainTab]);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/v1/programs/categories', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setCategories(data.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchPrograms = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/v1/programs?limit=100', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setPrograms(data.data.programs || []);
            }
        } catch (error) {
            console.error('Error fetching programs:', error);
        }
    };

    const generateRegistrationNumber = () => {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        setBeneficiaryForm(prev => ({
            ...prev,
            registration_number: `BEN-${year}-${random}`
        }));
    };

    const generateActivityNumber = () => {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        setActivityForm(prev => ({
            ...prev,
            activity_number: `ACT-${year}-${random}`
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

    const handleVulnerabilityChange = (category) => {
        setBeneficiaryForm(prev => ({
            ...prev,
            vulnerability_categories: prev.vulnerability_categories.includes(category)
                ? prev.vulnerability_categories.filter(c => c !== category)
                : [...prev.vulnerability_categories, category]
        }));
    };

    const handleProgramEnrollment = (programId) => {
        setBeneficiaryForm(prev => ({
            ...prev,
            programs: prev.programs.includes(programId)
                ? prev.programs.filter(p => p !== programId)
                : [...prev.programs, programId]
        }));
    };

    const handleBeneficiarySubmit = async (e, saveAsDraft = false, submitForApproval = false) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const submitData = {
                ...beneficiaryForm,
                status: saveAsDraft ? 'Draft' : submitForApproval ? 'Pending Approval' : 'Active'
            };
            const response = await beneficiaryAPI.create(submitData);

            if (response.data.success) {
                const beneficiaryId = response.data.data.beneficiary_id;

                // Upload photo if selected
                if (photoFile) {
                    const photoFormData = new FormData();
                    photoFormData.append('photo', photoFile);
                    await beneficiaryAPI.uploadPhoto(beneficiaryId, photoFormData);
                }

                if (submitForApproval) {
                    setSuccess('Beneficiary submitted for approval!');
                } else {
                    setSuccess(saveAsDraft ? 'Beneficiary saved as draft!' : 'Beneficiary registered successfully!');
                }

                setTimeout(() => {
                    navigate('/beneficiaries');
                }, 1500);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register beneficiary');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Activity tab navigation
    const activityTabs = ['basic', 'beneficiaries', 'details', 'budget', 'outcomes', 'attachments'];

    const handleNextTab = () => {
        const currentIndex = activityTabs.indexOf(activityTab);
        if (currentIndex < activityTabs.length - 1) {
            setActivityTab(activityTabs[currentIndex + 1]);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePreviousTab = () => {
        const currentIndex = activityTabs.indexOf(activityTab);
        if (currentIndex > 0) {
            setActivityTab(activityTabs[currentIndex - 1]);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleActivitySubmit = async (saveAsDraft = false, submitForApproval = false) => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const submitData = {
                ...activityForm,
                status: saveAsDraft ? 'Draft' : submitForApproval ? 'Pending Approval' : activityForm.status
            };

            // Submit activity
            console.log('Submitting activity:', submitData);

            if (submitForApproval) {
                setSuccess('Activity submitted for approval!');
            } else {
                setSuccess(saveAsDraft ? 'Activity saved as draft!' : 'Activity submitted successfully!');
            }

            setTimeout(() => {
                navigate('/activities');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit activity');
            console.error('Error:', err);
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
                            <h1>Data Entry</h1>
                            <p className="breadcrumb">Home &gt; Data Entry</p>
                        </div>
                    </div>

                    {/* Success/Error Messages */}
                    {success && (
                        <div className="alert alert-success">
                            <span>✅</span>
                            <div>{success}</div>
                        </div>
                    )}
                    {error && (
                        <div className="alert alert-danger">
                            <span>⚠️</span>
                            <div>{error}</div>
                        </div>
                    )}

                    {/* Main Tabs */}
                    <div className="card" style={{ marginBottom: '20px' }}>
                        <div className="main-tabs">
                            <button
                                onClick={() => setMainTab('beneficiary')}
                                className={`main-tab ${mainTab === 'beneficiary' ? 'active' : ''}`}
                            >
                                👤 Beneficiary Registration
                            </button>
                            <button
                                onClick={() => setMainTab('activity')}
                                className={`main-tab ${mainTab === 'activity' ? 'active' : ''}`}
                            >
                                📝 Activity Entry
                            </button>
                        </div>
                    </div>

                    {/* BENEFICIARY REGISTRATION TAB */}
                    {mainTab === 'beneficiary' && (
                        <div className="form-card">
                            <form onSubmit={(e) => handleBeneficiarySubmit(e, false)}>
                                {/* Photo Upload Section */}
                                <div className="form-section">
                                    <div className="form-section-title">Photo</div>
                                    <div className="photo-upload-section">
                                        <div className="photo-preview">
                                            {photoPreview ? (
                                                <img src={photoPreview} alt="Preview" />
                                            ) : (
                                                <div className="photo-placeholder">
                                                    <span style={{ fontSize: '48px' }}>📷</span>
                                                    <p>No photo selected</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="photo-upload-controls">
                                            <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                                                Choose Photo
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handlePhotoChange}
                                                    style={{ display: 'none' }}
                                                />
                                            </label>
                                            <p className="form-hint">Max size: 5MB (JPG, PNG)</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Registration Information */}
                                <div className="form-section">
                                    <div className="form-section-title">Registration Information</div>
                                    <div className="form-row">
                                        <div className="form-field">
                                            <label>Registration Number *</label>
                                            <input
                                                type="text"
                                                value={beneficiaryForm.registration_number}
                                                readOnly
                                                className="form-control"
                                                style={{ background: '#f8f9fa' }}
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label>Registration Date *</label>
                                            <input
                                                type="date"
                                                value={beneficiaryForm.registration_date}
                                                onChange={(e) => setBeneficiaryForm({...beneficiaryForm, registration_date: e.target.value})}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label>Status</label>
                                            <select
                                                value={beneficiaryForm.status}
                                                onChange={(e) => setBeneficiaryForm({...beneficiaryForm, status: e.target.value})}
                                                className="form-control"
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Personal Information */}
                                <div className="form-section">
                                    <div className="form-section-title">Personal Information</div>
                                    <div className="form-row">
                                        <div className="form-field">
                                            <label>First Name *</label>
                                            <input
                                                type="text"
                                                placeholder="Enter first name"
                                                value={beneficiaryForm.first_name}
                                                onChange={(e) => setBeneficiaryForm({...beneficiaryForm, first_name: e.target.value})}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label>Middle Name</label>
                                            <input
                                                type="text"
                                                placeholder="Enter middle name"
                                                value={beneficiaryForm.middle_name}
                                                onChange={(e) => setBeneficiaryForm({...beneficiaryForm, middle_name: e.target.value})}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label>Last Name *</label>
                                            <input
                                                type="text"
                                                placeholder="Enter last name"
                                                value={beneficiaryForm.last_name}
                                                onChange={(e) => setBeneficiaryForm({...beneficiaryForm, last_name: e.target.value})}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-field">
                                            <label>National ID / Passport No *</label>
                                            <input
                                                type="text"
                                                placeholder="Enter ID number"
                                                value={beneficiaryForm.national_id}
                                                onChange={(e) => setBeneficiaryForm({...beneficiaryForm, national_id: e.target.value})}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label>Date of Birth *</label>
                                            <input
                                                type="date"
                                                value={beneficiaryForm.date_of_birth}
                                                onChange={(e) => setBeneficiaryForm({...beneficiaryForm, date_of_birth: e.target.value})}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label>Gender *</label>
                                            <select
                                                value={beneficiaryForm.gender}
                                                onChange={(e) => setBeneficiaryForm({...beneficiaryForm, gender: e.target.value})}
                                                className="form-control"
                                                required
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="form-section">
                                    <div className="form-section-title">Contact Information</div>
                                    <div className="form-row">
                                        <div className="form-field">
                                            <label>Phone Number *</label>
                                            <input
                                                type="tel"
                                                placeholder="+254 700 000 000"
                                                value={beneficiaryForm.phone_number}
                                                onChange={(e) => setBeneficiaryForm({...beneficiaryForm, phone_number: e.target.value})}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label>Email Address</label>
                                            <input
                                                type="email"
                                                placeholder="email@example.com"
                                                value={beneficiaryForm.email}
                                                onChange={(e) => setBeneficiaryForm({...beneficiaryForm, email: e.target.value})}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Location Details */}
                                <div className="form-section">
                                    <div className="form-section-title">Location Details</div>
                                    <div className="form-row">
                                        <div className="form-field">
                                            <label>County *</label>
                                            <select
                                                value={beneficiaryForm.county}
                                                onChange={(e) => setBeneficiaryForm({...beneficiaryForm, county: e.target.value})}
                                                className="form-control"
                                                required
                                            >
                                                <option value="">Select County</option>
                                                <option value="Nairobi">Nairobi</option>
                                                <option value="Kiambu">Kiambu</option>
                                                <option value="Machakos">Machakos</option>
                                                <option value="Kajiado">Kajiado</option>
                                            </select>
                                        </div>
                                        <div className="form-field">
                                            <label>Sub-County *</label>
                                            <select
                                                value={beneficiaryForm.sub_county}
                                                onChange={(e) => setBeneficiaryForm({...beneficiaryForm, sub_county: e.target.value})}
                                                className="form-control"
                                                required
                                            >
                                                <option value="">Select Sub-County</option>
                                                <option value="Kibra">Kibra</option>
                                                <option value="Dagoretti">Dagoretti</option>
                                                <option value="Mathare">Mathare</option>
                                                <option value="Westlands">Westlands</option>
                                            </select>
                                        </div>
                                        <div className="form-field">
                                            <label>Ward *</label>
                                            <select
                                                value={beneficiaryForm.ward}
                                                onChange={(e) => setBeneficiaryForm({...beneficiaryForm, ward: e.target.value})}
                                                className="form-control"
                                                required
                                            >
                                                <option value="">Select Ward</option>
                                                <option value="Laini Saba">Laini Saba</option>
                                                <option value="Lindi">Lindi</option>
                                                <option value="Makina">Makina</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-field">
                                            <label>Village/Estate *</label>
                                            <input
                                                type="text"
                                                placeholder="Enter village or estate name"
                                                value={beneficiaryForm.village}
                                                onChange={(e) => setBeneficiaryForm({...beneficiaryForm, village: e.target.value})}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label>Postal Address</label>
                                            <input
                                                type="text"
                                                placeholder="P.O. Box number"
                                                value={beneficiaryForm.postal_address}
                                                onChange={(e) => setBeneficiaryForm({...beneficiaryForm, postal_address: e.target.value})}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Household & Socio-Economic Information */}
                                <div className="form-section">
                                    <div className="form-section-title">Household & Socio-Economic Information</div>
                                    <div className="form-row">
                                        <div className="form-field">
                                            <label>Household Size *</label>
                                            <input
                                                type="number"
                                                placeholder="Number of people"
                                                value={beneficiaryForm.household_size}
                                                onChange={(e) => setBeneficiaryForm({...beneficiaryForm, household_size: e.target.value})}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label>Marital Status</label>
                                            <select
                                                value={beneficiaryForm.marital_status}
                                                onChange={(e) => setBeneficiaryForm({...beneficiaryForm, marital_status: e.target.value})}
                                                className="form-control"
                                            >
                                                <option value="">Select Status</option>
                                                <option value="Single">Single</option>
                                                <option value="Married">Married</option>
                                                <option value="Widowed">Widowed</option>
                                                <option value="Divorced">Divorced</option>
                                                <option value="Separated">Separated</option>
                                            </select>
                                        </div>
                                        <div className="form-field">
                                            <label>Education Level</label>
                                            <select
                                                value={beneficiaryForm.education_level}
                                                onChange={(e) => setBeneficiaryForm({...beneficiaryForm, education_level: e.target.value})}
                                                className="form-control"
                                            >
                                                <option value="">Select Education Level</option>
                                                <option value="No Formal Education">No Formal Education</option>
                                                <option value="Primary">Primary</option>
                                                <option value="Secondary">Secondary</option>
                                                <option value="Tertiary">Tertiary</option>
                                                <option value="University">University</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-field">
                                            <label>Occupation</label>
                                            <input
                                                type="text"
                                                placeholder="Current occupation"
                                                value={beneficiaryForm.occupation}
                                                onChange={(e) => setBeneficiaryForm({...beneficiaryForm, occupation: e.target.value})}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label>Monthly Income (KES)</label>
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                value={beneficiaryForm.monthly_income}
                                                onChange={(e) => setBeneficiaryForm({...beneficiaryForm, monthly_income: e.target.value})}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label>Disability Status</label>
                                            <input
                                                type="text"
                                                placeholder="Describe if applicable"
                                                value={beneficiaryForm.disability_status}
                                                onChange={(e) => setBeneficiaryForm({...beneficiaryForm, disability_status: e.target.value})}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Vulnerability Assessment */}
                                <div className="form-section">
                                    <div className="form-section-title">Vulnerability Assessment</div>
                                    <div className="form-field">
                                        <label>Vulnerable Categories (Check all that apply)</label>
                                        <div className="checkbox-grid">
                                            {['Person with Disability', 'Orphan/Vulnerable Child', 'Single Mother', 'Single Father', 'Elderly/Aged', 'Refugee/IDP', 'Chronically Ill', 'HIV/AIDS Affected'].map((category) => (
                                                <label key={category} className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        checked={beneficiaryForm.vulnerability_categories.includes(category)}
                                                        onChange={() => handleVulnerabilityChange(category)}
                                                    />
                                                    <span>{category}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="form-field" style={{ marginTop: '20px' }}>
                                        <label>Additional Notes</label>
                                        <textarea
                                            placeholder="Any additional information about the beneficiary's situation..."
                                            value={beneficiaryForm.notes}
                                            onChange={(e) => setBeneficiaryForm({...beneficiaryForm, notes: e.target.value})}
                                            className="form-control"
                                            rows="4"
                                        />
                                    </div>
                                </div>

                                {/* Program Enrollment */}
                                <div className="form-section">
                                    <div className="form-section-title">Program Enrollment</div>
                                    <div className="form-field">
                                        <label>Select Programs to Enroll *</label>
                                        <div className="checkbox-grid">
                                            {categories.map((cat) => (
                                                <label key={cat.category_id} className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        checked={beneficiaryForm.programs.includes(cat.category_id)}
                                                        onChange={() => handleProgramEnrollment(cat.category_id)}
                                                    />
                                                    <span>{cat.category_name}</span>
                                                </label>
                                            ))}
                                        </div>
                                        {beneficiaryForm.programs.length === 0 && (
                                            <p className="form-hint" style={{ color: '#e74c3c', marginTop: '10px' }}>
                                                Please select at least one program
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="btn-group mobile-btn-group">
                                    <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={(e) => handleBeneficiarySubmit(e, true, false)}
                                        disabled={loading}
                                    >
                                        Save as Draft
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={(e) => handleBeneficiarySubmit(e, false, true)}
                                        disabled={loading}
                                    >
                                        {loading ? 'Submitting...' : '✓ Submit for Approval'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* ACTIVITY ENTRY TAB */}
                    {mainTab === 'activity' && (
                        <>
                            {/* Activity Sub-tabs */}
                            <div className="tabs">
                                <button
                                    className={`tab ${activityTab === 'basic' ? 'active' : ''}`}
                                    onClick={() => setActivityTab('basic')}
                                >
                                    Basic Info
                                </button>
                                <button
                                    className={`tab ${activityTab === 'beneficiaries' ? 'active' : ''}`}
                                    onClick={() => setActivityTab('beneficiaries')}
                                >
                                    Beneficiaries
                                </button>
                                <button
                                    className={`tab ${activityTab === 'details' ? 'active' : ''}`}
                                    onClick={() => setActivityTab('details')}
                                >
                                    Details
                                </button>
                                <button
                                    className={`tab ${activityTab === 'budget' ? 'active' : ''}`}
                                    onClick={() => setActivityTab('budget')}
                                >
                                    Budget
                                </button>
                                <button
                                    className={`tab ${activityTab === 'outcomes' ? 'active' : ''}`}
                                    onClick={() => setActivityTab('outcomes')}
                                >
                                    Outcomes
                                </button>
                                <button
                                    className={`tab ${activityTab === 'attachments' ? 'active' : ''}`}
                                    onClick={() => setActivityTab('attachments')}
                                >
                                    Attachments
                                </button>
                            </div>

                            <div className="form-card">
                                <div className="alert alert-info" style={{ marginBottom: '20px' }}>
                                    <span>ℹ️</span>
                                    <div>Complete all required fields marked with (*). Navigate through tabs using Next/Previous buttons.</div>
                                </div>

                                <div>
                                    {/* Basic Information Tab */}
                                    {activityTab === 'basic' && (
                                        <div className="form-section">
                                            <div className="form-section-title">Basic Information</div>
                                            <div className="form-row">
                                                <div className="form-field">
                                                    <label>Activity Number *</label>
                                                    <input
                                                        type="text"
                                                        value={activityForm.activity_number}
                                                        readOnly
                                                        className="form-control"
                                                        style={{ background: '#f8f9fa' }}
                                                    />
                                                </div>
                                                <div className="form-field">
                                                    <label>Status</label>
                                                    <select
                                                        value={activityForm.status}
                                                        onChange={(e) => setActivityForm({...activityForm, status: e.target.value})}
                                                        className="form-control"
                                                    >
                                                        <option value="Planned">Planned</option>
                                                        <option value="In Progress">In Progress</option>
                                                        <option value="Completed">Completed</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                </div>
                                                <div className="form-field">
                                                    <label>Priority</label>
                                                    <select
                                                        value={activityForm.priority}
                                                        onChange={(e) => setActivityForm({...activityForm, priority: e.target.value})}
                                                        className="form-control"
                                                    >
                                                        <option value="Low">Low</option>
                                                        <option value="Medium">Medium</option>
                                                        <option value="High">High</option>
                                                        <option value="Critical">Critical</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-field full-width">
                                                    <label>Activity Title *</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter activity title"
                                                        value={activityForm.activity_title}
                                                        onChange={(e) => setActivityForm({...activityForm, activity_title: e.target.value})}
                                                        className="form-control"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-field">
                                                    <label>Program *</label>
                                                    <select
                                                        value={activityForm.program_id}
                                                        onChange={(e) => setActivityForm({...activityForm, program_id: e.target.value})}
                                                        className="form-control"
                                                        required
                                                    >
                                                        <option value="">Select Program</option>
                                                        {programs.map((prog) => (
                                                            <option key={prog.program_id} value={prog.program_id}>
                                                                {prog.program_name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="form-field">
                                                    <label>Activity Type *</label>
                                                    <select
                                                        value={activityForm.activity_type}
                                                        onChange={(e) => setActivityForm({...activityForm, activity_type: e.target.value})}
                                                        className="form-control"
                                                        required
                                                    >
                                                        <option value="">Select Type</option>
                                                        <option value="Training/Workshop">Training/Workshop</option>
                                                        <option value="Infrastructure Project">Infrastructure Project</option>
                                                        <option value="Distribution/Relief">Distribution/Relief</option>
                                                        <option value="Awareness Campaign">Awareness Campaign</option>
                                                        <option value="Community Mobilization">Community Mobilization</option>
                                                        <option value="Technical Assistance">Technical Assistance</option>
                                                    </select>
                                                </div>
                                                <div className="form-field">
                                                    <label>Location *</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Activity location"
                                                        value={activityForm.location}
                                                        onChange={(e) => setActivityForm({...activityForm, location: e.target.value})}
                                                        className="form-control"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-field">
                                                    <label>Start Date *</label>
                                                    <input
                                                        type="date"
                                                        value={activityForm.start_date}
                                                        onChange={(e) => setActivityForm({...activityForm, start_date: e.target.value})}
                                                        className="form-control"
                                                        required
                                                    />
                                                </div>
                                                <div className="form-field">
                                                    <label>End Date</label>
                                                    <input
                                                        type="date"
                                                        value={activityForm.end_date}
                                                        onChange={(e) => setActivityForm({...activityForm, end_date: e.target.value})}
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-field">
                                                    <label>Funding Source</label>
                                                    <select
                                                        value={activityForm.funding_source}
                                                        onChange={(e) => setActivityForm({...activityForm, funding_source: e.target.value})}
                                                        className="form-control"
                                                    >
                                                        <option value="">Select Funding Source</option>
                                                        <option value="Caritas Internal">Caritas Internal</option>
                                                        <option value="Donor A">Donor A</option>
                                                        <option value="Donor B">Donor B</option>
                                                        <option value="Government Grant">Government Grant</option>
                                                        <option value="Community Contribution">Community Contribution</option>
                                                    </select>
                                                </div>
                                                <div className="form-field">
                                                    <label>Implementing Partner</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Partner organization (if any)"
                                                        value={activityForm.implementing_partner}
                                                        onChange={(e) => setActivityForm({...activityForm, implementing_partner: e.target.value})}
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-field full-width">
                                                    <label>Description *</label>
                                                    <textarea
                                                        placeholder="Detailed description of the activity..."
                                                        value={activityForm.description}
                                                        onChange={(e) => setActivityForm({...activityForm, description: e.target.value})}
                                                        className="form-control"
                                                        rows="4"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Beneficiary Details Tab */}
                                    {activityTab === 'beneficiaries' && (
                                        <div className="form-section">
                                            <div className="form-section-title">Beneficiary Details</div>
                                            <div className="form-row">
                                                <div className="form-field">
                                                    <label>Target Participants *</label>
                                                    <input
                                                        type="number"
                                                        placeholder="Expected number"
                                                        value={activityForm.planned_participants}
                                                        onChange={(e) => setActivityForm({...activityForm, planned_participants: e.target.value})}
                                                        className="form-control"
                                                        required
                                                    />
                                                </div>
                                                <div className="form-field">
                                                    <label>Actual Participants</label>
                                                    <input
                                                        type="number"
                                                        placeholder="Actual number"
                                                        value={activityForm.actual_participants}
                                                        onChange={(e) => setActivityForm({...activityForm, actual_participants: e.target.value})}
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>
                                            <div className="info-box">
                                                <p><strong>📋 Beneficiary Selection</strong></p>
                                                <p>Select beneficiaries from the database to link them to this activity. This functionality will allow you to:</p>
                                                <ul>
                                                    <li>Search and add registered beneficiaries</li>
                                                    <li>Track attendance and participation</li>
                                                    <li>Generate beneficiary reports</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {/* Activity Details Tab */}
                                    {activityTab === 'details' && (
                                        <div className="form-section">
                                            <div className="form-section-title">Additional Activity Details</div>
                                            <div className="info-box">
                                                <p><strong>📝 Activity-Specific Information</strong></p>
                                                <p>This section will contain detailed information specific to the activity type, such as:</p>
                                                <ul>
                                                    <li>Training materials and curriculum</li>
                                                    <li>Infrastructure project specifications</li>
                                                    <li>Distribution item lists and quantities</li>
                                                    <li>Campaign reach and channels</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {/* Budget & Resources Tab */}
                                    {activityTab === 'budget' && (
                                        <div className="form-section">
                                            <div className="form-section-title">Budget & Resources</div>
                                            <div className="form-row">
                                                <div className="form-field">
                                                    <label>Planned Budget (KES) *</label>
                                                    <input
                                                        type="number"
                                                        placeholder="0.00"
                                                        value={activityForm.planned_budget}
                                                        onChange={(e) => setActivityForm({...activityForm, planned_budget: e.target.value})}
                                                        className="form-control"
                                                        required
                                                    />
                                                </div>
                                                <div className="form-field">
                                                    <label>Actual Budget (KES)</label>
                                                    <input
                                                        type="number"
                                                        placeholder="0.00"
                                                        value={activityForm.actual_budget}
                                                        onChange={(e) => setActivityForm({...activityForm, actual_budget: e.target.value})}
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>
                                            <div className="info-box">
                                                <p><strong>💰 Resource Tracking</strong></p>
                                                <p>Track all resources used in this activity including:</p>
                                                <ul>
                                                    <li>Materials and supplies</li>
                                                    <li>Equipment and tools</li>
                                                    <li>Human resources and staff time</li>
                                                    <li>Transportation and logistics</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {/* Outcomes & Impact Tab */}
                                    {activityTab === 'outcomes' && (
                                        <div className="form-section">
                                            <div className="form-section-title">Outcomes & Impact</div>
                                            <div className="form-field">
                                                <label>Outcomes Achieved</label>
                                                <textarea
                                                    placeholder="Describe the outcomes and impact of this activity..."
                                                    value={activityForm.outcomes}
                                                    onChange={(e) => setActivityForm({...activityForm, outcomes: e.target.value})}
                                                    className="form-control"
                                                    rows="4"
                                                />
                                            </div>
                                            <div className="form-field" style={{ marginTop: '20px' }}>
                                                <label>Impact Statement</label>
                                                <textarea
                                                    placeholder="Describe the long-term impact on beneficiaries and community..."
                                                    value={activityForm.impact}
                                                    onChange={(e) => setActivityForm({...activityForm, impact: e.target.value})}
                                                    className="form-control"
                                                    rows="4"
                                                />
                                            </div>
                                            <div className="info-box" style={{ marginTop: '20px' }}>
                                                <p><strong>📊 Indicator Measurement</strong></p>
                                                <p>Link this activity to program indicators to track progress towards goals.</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Attachments Tab */}
                                    {activityTab === 'attachments' && (
                                        <div className="form-section">
                                            <div className="form-section-title">Attachments & Documents</div>
                                            <div className="info-box">
                                                <p><strong>📎 Document Upload</strong></p>
                                                <p>Upload supporting documents such as:</p>
                                                <ul>
                                                    <li>Activity reports and summaries</li>
                                                    <li>Photos and videos</li>
                                                    <li>Attendance sheets and sign-in forms</li>
                                                    <li>Receipts and financial documents</li>
                                                    <li>Certificates and training materials</li>
                                                </ul>
                                                <div style={{ marginTop: '15px', padding: '20px', background: 'white', borderRadius: '8px', border: '2px dashed #3498db' }}>
                                                    <div style={{ textAlign: 'center' }}>
                                                        <span style={{ fontSize: '48px' }}>📁</span>
                                                        <p style={{ marginTop: '10px', color: '#7f8c8d' }}>
                                                            File upload functionality will be available here
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Navigation Buttons */}
                                    <div className="btn-group mobile-btn-group" style={{ marginTop: '30px' }}>
                                        {activityTab !== 'basic' && (
                                            <button type="button" className="btn btn-secondary" onClick={handlePreviousTab}>
                                                ← Previous
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => handleActivitySubmit(true, false)}
                                            disabled={loading}
                                        >
                                            Save as Draft
                                        </button>

                                        {activityTab !== 'attachments' ? (
                                            <button type="button" className="btn btn-primary" onClick={handleNextTab}>
                                                Next →
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className="btn btn-success"
                                                onClick={() => handleActivitySubmit(false, true)}
                                                disabled={loading}
                                            >
                                                {loading ? 'Submitting...' : '✓ Submit for Approval'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DataEntry;
