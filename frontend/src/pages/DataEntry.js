// =====================================================
// DATA ENTRY PAGE
// =====================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/App.css';

const DataEntry = () => {
    const navigate = useNavigate();
    const [mainTab, setMainTab] = useState('beneficiary'); // beneficiary or activity
    const [activityTab, setActivityTab] = useState('basic'); // For activity sub-tabs
    const [categories, setCategories] = useState([]);

    // Beneficiary form state
    const [beneficiaryForm, setBeneficiaryForm] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        national_id: '',
        date_of_birth: '',
        gender: '',
        phone_number: '',
        email: '',
        county: '',
        sub_county: '',
        ward: '',
        village: '',
        household_size: '',
        marital_status: '',
        education_level: '',
        occupation: '',
        vulnerability: [],
        programs: [],
        notes: ''
    });

    // Activity form state
    const [activityForm, setActivityForm] = useState({
        activity_title: '',
        program_module: '',
        sub_program: '',
        activity_type: '',
        location: '',
        start_date: '',
        end_date: '',
        implementing_partner: '',
        funding_source: '',
        project_code: '',
        description: '',
        // Beneficiary tab
        target_participants: '',
        actual_participants: '',
        beneficiaries: [],
        // Budget tab
        planned_budget: '',
        actual_budget: '',
        resources: [],
        // Outcomes tab
        outcomes: '',
        impact: '',
        indicators: []
    });

    useEffect(() => {
        fetchCategories();
    }, []);

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

    const handleBeneficiarySubmit = async (e) => {
        e.preventDefault();
        // Submit beneficiary
        console.log('Submitting beneficiary:', beneficiaryForm);
    };

    const handleActivitySubmit = async (e) => {
        e.preventDefault();
        // Submit activity
        console.log('Submitting activity:', activityForm);
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

                    {/* Main Tabs */}
                    <div className="card" style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', gap: '20px', borderBottom: '2px solid #ecf0f1' }}>
                            <button
                                onClick={() => setMainTab('beneficiary')}
                                style={{
                                    padding: '15px 25px',
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                    fontWeight: mainTab === 'beneficiary' ? 'bold' : 'normal',
                                    borderBottom: mainTab === 'beneficiary' ? '3px solid #3498db' : 'none',
                                    color: mainTab === 'beneficiary' ? '#3498db' : '#7f8c8d'
                                }}
                            >
                                👤 Beneficiary Registration
                            </button>
                            <button
                                onClick={() => setMainTab('activity')}
                                style={{
                                    padding: '15px 25px',
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                    fontWeight: mainTab === 'activity' ? 'bold' : 'normal',
                                    borderBottom: mainTab === 'activity' ? '3px solid #3498db' : 'none',
                                    color: mainTab === 'activity' ? '#3498db' : '#7f8c8d'
                                }}
                            >
                                📝 Activity Entry
                            </button>
                        </div>
                    </div>

                    {/* BENEFICIARY REGISTRATION TAB */}
                    {mainTab === 'beneficiary' && (
                        <div className="form-card">
                            <form onSubmit={handleBeneficiarySubmit}>
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
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label>Last Name *</label>
                                            <input
                                                type="text"
                                                placeholder="Enter last name"
                                                value={beneficiaryForm.last_name}
                                                onChange={(e) => setBeneficiaryForm({...beneficiaryForm, last_name: e.target.value})}
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
                                                required
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label>Date of Birth *</label>
                                            <input
                                                type="date"
                                                value={beneficiaryForm.date_of_birth}
                                                onChange={(e) => setBeneficiaryForm({...beneficiaryForm, date_of_birth: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label>Gender *</label>
                                            <select
                                                value={beneficiaryForm.gender}
                                                onChange={(e) => setBeneficiaryForm({...beneficiaryForm, gender: e.target.value})}
                                                required
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-field">
                                            <label>Phone Number *</label>
                                            <input
                                                type="tel"
                                                placeholder="+254 700 000 000"
                                                value={beneficiaryForm.phone_number}
                                                onChange={(e) => setBeneficiaryForm({...beneficiaryForm, phone_number: e.target.value})}
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
                                            />
                                        </div>
                                        <div className="form-field"></div>
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
                                                required
                                            >
                                                <option value="">Select County</option>
                                                <option value="Nairobi">Nairobi</option>
                                                <option value="Kiambu">Kiambu</option>
                                                <option value="Machakos">Machakos</option>
                                            </select>
                                        </div>
                                        <div className="form-field">
                                            <label>Sub-County *</label>
                                            <select
                                                value={beneficiaryForm.sub_county}
                                                onChange={(e) => setBeneficiaryForm({...beneficiaryForm, sub_county: e.target.value})}
                                                required
                                            >
                                                <option value="">Select Sub-County</option>
                                                <option value="Kibra">Kibra</option>
                                                <option value="Dagoretti">Dagoretti</option>
                                                <option value="Mathare">Mathare</option>
                                            </select>
                                        </div>
                                        <div className="form-field">
                                            <label>Ward *</label>
                                            <select
                                                value={beneficiaryForm.ward}
                                                onChange={(e) => setBeneficiaryForm({...beneficiaryForm, ward: e.target.value})}
                                                required
                                            >
                                                <option value="">Select Ward</option>
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
                                                required
                                            />
                                        </div>
                                        <div className="form-field"></div>
                                        <div className="form-field"></div>
                                    </div>
                                </div>

                                {/* Household Information */}
                                <div className="form-section">
                                    <div className="form-section-title">Household Information</div>
                                    <div className="form-row">
                                        <div className="form-field">
                                            <label>Household Size *</label>
                                            <input
                                                type="number"
                                                placeholder="Number of people"
                                                value={beneficiaryForm.household_size}
                                                onChange={(e) => setBeneficiaryForm({...beneficiaryForm, household_size: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label>Marital Status</label>
                                            <select
                                                value={beneficiaryForm.marital_status}
                                                onChange={(e) => setBeneficiaryForm({...beneficiaryForm, marital_status: e.target.value})}
                                            >
                                                <option value="">Select Status</option>
                                                <option value="Single">Single</option>
                                                <option value="Married">Married</option>
                                                <option value="Widowed">Widowed</option>
                                                <option value="Divorced">Divorced</option>
                                            </select>
                                        </div>
                                        <div className="form-field">
                                            <label>Education Level</label>
                                            <select
                                                value={beneficiaryForm.education_level}
                                                onChange={(e) => setBeneficiaryForm({...beneficiaryForm, education_level: e.target.value})}
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
                                            />
                                        </div>
                                        <div className="form-field"></div>
                                        <div className="form-field"></div>
                                    </div>
                                </div>

                                {/* Vulnerability Assessment */}
                                <div className="form-section">
                                    <div className="form-section-title">Vulnerability Assessment</div>
                                    <div className="form-field">
                                        <label>Vulnerable Categories (Check all that apply)</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '10px' }}>
                                            {['Person with Disability', 'Orphan/Vulnerable Child', 'Single Mother', 'Elderly/Aged', 'Refugee/IDP', 'Chronically Ill'].map((category) => (
                                                <label key={category} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <input type="checkbox" /> {category}
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
                                        />
                                    </div>
                                </div>

                                {/* Program Enrollment */}
                                <div className="form-section">
                                    <div className="form-section-title">Program Enrollment</div>
                                    <div className="form-field">
                                        <label>Select Programs to Enroll *</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginTop: '10px' }}>
                                            {categories.map((cat) => (
                                                <label key={cat.category_id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <input type="checkbox" /> {cat.category_name}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="btn-group">
                                    <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                                        Cancel
                                    </button>
                                    <button type="button" className="btn btn-secondary">
                                        Save as Draft
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Register Beneficiary
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
                                    Basic Information
                                </button>
                                <button
                                    className={`tab ${activityTab === 'beneficiaries' ? 'active' : ''}`}
                                    onClick={() => setActivityTab('beneficiaries')}
                                >
                                    Beneficiary Details
                                </button>
                                <button
                                    className={`tab ${activityTab === 'details' ? 'active' : ''}`}
                                    onClick={() => setActivityTab('details')}
                                >
                                    Activity Details
                                </button>
                                <button
                                    className={`tab ${activityTab === 'budget' ? 'active' : ''}`}
                                    onClick={() => setActivityTab('budget')}
                                >
                                    Budget & Resources
                                </button>
                                <button
                                    className={`tab ${activityTab === 'outcomes' ? 'active' : ''}`}
                                    onClick={() => setActivityTab('outcomes')}
                                >
                                    Outcomes & Impact
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
                                    <div>Complete all required fields marked with (*). You can save as draft and continue later.</div>
                                </div>

                                <form onSubmit={handleActivitySubmit}>
                                    {/* Basic Information Tab */}
                                    {activityTab === 'basic' && (
                                        <div className="form-section">
                                            <div className="form-section-title">Basic Information</div>
                                            <div className="form-row">
                                                <div className="form-field">
                                                    <label>Activity Title *</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter activity title"
                                                        value={activityForm.activity_title}
                                                        onChange={(e) => setActivityForm({...activityForm, activity_title: e.target.value})}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-field">
                                                    <label>Program Module *</label>
                                                    <select
                                                        value={activityForm.program_module}
                                                        onChange={(e) => setActivityForm({...activityForm, program_module: e.target.value})}
                                                        required
                                                    >
                                                        <option value="">Select Program Module</option>
                                                        {categories.map((cat) => (
                                                            <option key={cat.category_id} value={cat.category_id}>
                                                                {cat.category_name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-field">
                                                    <label>Activity Type *</label>
                                                    <select
                                                        value={activityForm.activity_type}
                                                        onChange={(e) => setActivityForm({...activityForm, activity_type: e.target.value})}
                                                        required
                                                    >
                                                        <option value="">Select Activity Type</option>
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
                                                        required
                                                    />
                                                </div>
                                                <div className="form-field">
                                                    <label>End Date</label>
                                                    <input
                                                        type="date"
                                                        value={activityForm.end_date}
                                                        onChange={(e) => setActivityForm({...activityForm, end_date: e.target.value})}
                                                    />
                                                </div>
                                                <div className="form-field">
                                                    <label>Funding Source</label>
                                                    <select
                                                        value={activityForm.funding_source}
                                                        onChange={(e) => setActivityForm({...activityForm, funding_source: e.target.value})}
                                                    >
                                                        <option value="">Select Funding Source</option>
                                                        <option value="Caritas Internal">Caritas Internal</option>
                                                        <option value="Donor A">Donor A</option>
                                                        <option value="Donor B">Donor B</option>
                                                        <option value="Government Grant">Government Grant</option>
                                                        <option value="Community Contribution">Community Contribution</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                                                    <label>Description *</label>
                                                    <textarea
                                                        placeholder="Detailed description of the activity..."
                                                        value={activityForm.description}
                                                        onChange={(e) => setActivityForm({...activityForm, description: e.target.value})}
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
                                                        placeholder="Expected number of participants"
                                                        value={activityForm.target_participants}
                                                        onChange={(e) => setActivityForm({...activityForm, target_participants: e.target.value})}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-field">
                                                    <label>Actual Participants</label>
                                                    <input
                                                        type="number"
                                                        placeholder="Actual number of participants"
                                                        value={activityForm.actual_participants}
                                                        onChange={(e) => setActivityForm({...activityForm, actual_participants: e.target.value})}
                                                    />
                                                </div>
                                                <div className="form-field"></div>
                                            </div>
                                            <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                                                <p style={{ color: '#7f8c8d', marginBottom: '10px' }}>
                                                    Beneficiary selection and tracking will be available here.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Activity Details Tab */}
                                    {activityTab === 'details' && (
                                        <div className="form-section">
                                            <div className="form-section-title">Activity Details</div>
                                            <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                                                <p style={{ color: '#7f8c8d' }}>
                                                    Additional activity-specific details will be captured here.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Budget & Resources Tab */}
                                    {activityTab === 'budget' && (
                                        <div className="form-section">
                                            <div className="form-section-title">Budget & Resources</div>
                                            <div className="form-row">
                                                <div className="form-field">
                                                    <label>Planned Budget *</label>
                                                    <input
                                                        type="number"
                                                        placeholder="0.00"
                                                        value={activityForm.planned_budget}
                                                        onChange={(e) => setActivityForm({...activityForm, planned_budget: e.target.value})}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-field">
                                                    <label>Actual Budget</label>
                                                    <input
                                                        type="number"
                                                        placeholder="0.00"
                                                        value={activityForm.actual_budget}
                                                        onChange={(e) => setActivityForm({...activityForm, actual_budget: e.target.value})}
                                                    />
                                                </div>
                                                <div className="form-field"></div>
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
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Attachments Tab */}
                                    {activityTab === 'attachments' && (
                                        <div className="form-section">
                                            <div className="form-section-title">Attachments</div>
                                            <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                                                <p style={{ color: '#7f8c8d' }}>
                                                    File upload functionality will be available here.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="btn-group" style={{ marginTop: '30px' }}>
                                        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                                            Cancel
                                        </button>
                                        <button type="button" className="btn btn-secondary">
                                            Save as Draft
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            Submit Activity
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DataEntry;
