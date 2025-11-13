// =====================================================
// BENEFICIARY DETAILS PAGE
// =====================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { beneficiaryAPI } from '../services/api';
import '../styles/App.css';

const BeneficiaryDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [beneficiary, setBeneficiary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBeneficiary();
    }, [id]);

    const fetchBeneficiary = async () => {
        try {
            setLoading(true);
            const response = await beneficiaryAPI.getById(id);
            if (response.data.success) {
                setBeneficiary(response.data.data);
            }
        } catch (err) {
            setError('Failed to load beneficiary details');
            console.error('Error fetching beneficiary:', err);
        } finally {
            setLoading(false);
        }
    };

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

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this beneficiary?')) {
            try {
                await beneficiaryAPI.delete(id);
                navigate('/beneficiaries');
            } catch (err) {
                alert('Failed to delete beneficiary');
                console.error('Error deleting beneficiary:', err);
            }
        }
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
                            <p>Loading beneficiary details...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !beneficiary) {
        return (
            <div className="app-container">
                <Sidebar />
                <div className="main-content">
                    <Header />
                    <div className="content-area">
                        <div className="alert alert-danger">
                            {error || 'Beneficiary not found'}
                        </div>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate('/beneficiaries')}
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
                            <h1>Beneficiary Details</h1>
                            <p>View complete beneficiary information</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                className="btn btn-secondary"
                                onClick={() => navigate('/beneficiaries')}
                            >
                                ← Back to List
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate(`/beneficiaries/edit/${id}`)}
                            >
                                ✏️ Edit
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleDelete}
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div style={{ marginBottom: '20px' }}>
                        <span className={`badge ${
                            beneficiary.status === 'Active' ? 'badge-success' :
                            beneficiary.status === 'Inactive' ? 'badge-warning' :
                            'badge-danger'
                        }`} style={{ fontSize: '14px', padding: '8px 16px' }}>
                            {beneficiary.status}
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                        {/* Left Column - Photo & Quick Info */}
                        <div>
                            {/* Photo Card */}
                            <div className="card" style={{ marginBottom: '20px', textAlign: 'center' }}>
                                {beneficiary.photo ? (
                                    <img
                                        src={`http://localhost:5000${beneficiary.photo}`}
                                        alt={`${beneficiary.first_name} ${beneficiary.last_name}`}
                                        style={{
                                            width: '100%',
                                            maxWidth: '300px',
                                            height: 'auto',
                                            borderRadius: '8px',
                                            marginBottom: '15px'
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '100%',
                                        height: '300px',
                                        backgroundColor: '#ecf0f1',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '8px',
                                        marginBottom: '15px',
                                        fontSize: '72px'
                                    }}>
                                        👤
                                    </div>
                                )}
                                <h3>{beneficiary.first_name} {beneficiary.middle_name} {beneficiary.last_name}</h3>
                                <p style={{ color: '#7f8c8d' }}>{beneficiary.registration_number}</p>
                            </div>

                            {/* Quick Stats */}
                            <div className="card">
                                <h4 style={{ marginBottom: '15px' }}>Quick Stats</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                                        <span><strong>Age:</strong></span>
                                        <span>{calculateAge(beneficiary.date_of_birth)} years</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                                        <span><strong>Gender:</strong></span>
                                        <span>{beneficiary.gender}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                                        <span><strong>Household Size:</strong></span>
                                        <span>{beneficiary.household_size || 'N/A'}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                                        <span><strong>Registered:</strong></span>
                                        <span>{new Date(beneficiary.registration_date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Detailed Information */}
                        <div>
                            {/* Personal Information */}
                            <div className="card" style={{ marginBottom: '20px' }}>
                                <h3>Personal Information</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div>
                                        <label style={{ fontWeight: 'bold', color: '#7f8c8d', fontSize: '12px' }}>First Name</label>
                                        <p>{beneficiary.first_name}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: 'bold', color: '#7f8c8d', fontSize: '12px' }}>Middle Name</label>
                                        <p>{beneficiary.middle_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: 'bold', color: '#7f8c8d', fontSize: '12px' }}>Last Name</label>
                                        <p>{beneficiary.last_name}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: 'bold', color: '#7f8c8d', fontSize: '12px' }}>Date of Birth</label>
                                        <p>{new Date(beneficiary.date_of_birth).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: 'bold', color: '#7f8c8d', fontSize: '12px' }}>Gender</label>
                                        <p>{beneficiary.gender}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: 'bold', color: '#7f8c8d', fontSize: '12px' }}>National ID</label>
                                        <p>{beneficiary.national_id || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: 'bold', color: '#7f8c8d', fontSize: '12px' }}>Marital Status</label>
                                        <p>{beneficiary.marital_status || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: 'bold', color: '#7f8c8d', fontSize: '12px' }}>Education Level</label>
                                        <p>{beneficiary.education_level || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: 'bold', color: '#7f8c8d', fontSize: '12px' }}>Occupation</label>
                                        <p>{beneficiary.occupation || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: 'bold', color: '#7f8c8d', fontSize: '12px' }}>Disability Status</label>
                                        <p>{beneficiary.disability_status || 'None'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="card" style={{ marginBottom: '20px' }}>
                                <h3>Contact Information</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div>
                                        <label style={{ fontWeight: 'bold', color: '#7f8c8d', fontSize: '12px' }}>Phone Number</label>
                                        <p>{beneficiary.phone_number || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: 'bold', color: '#7f8c8d', fontSize: '12px' }}>Email</label>
                                        <p>{beneficiary.email || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Household & Economic Information */}
                            <div className="card" style={{ marginBottom: '20px' }}>
                                <h3>Household & Economic Information</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div>
                                        <label style={{ fontWeight: 'bold', color: '#7f8c8d', fontSize: '12px' }}>Household Size</label>
                                        <p>{beneficiary.household_size || 'N/A'} members</p>
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: 'bold', color: '#7f8c8d', fontSize: '12px' }}>Monthly Income</label>
                                        <p>
                                            {beneficiary.monthly_income
                                                ? `KES ${parseFloat(beneficiary.monthly_income).toLocaleString()}`
                                                : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Registration Information */}
                            <div className="card">
                                <h3>Registration Information</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div>
                                        <label style={{ fontWeight: 'bold', color: '#7f8c8d', fontSize: '12px' }}>Registration Number</label>
                                        <p>{beneficiary.registration_number}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: 'bold', color: '#7f8c8d', fontSize: '12px' }}>Registration Date</label>
                                        <p>{new Date(beneficiary.registration_date).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: 'bold', color: '#7f8c8d', fontSize: '12px' }}>Created At</label>
                                        <p>{new Date(beneficiary.created_at).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: 'bold', color: '#7f8c8d', fontSize: '12px' }}>Last Updated</label>
                                        <p>{new Date(beneficiary.updated_at).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeneficiaryDetails;
