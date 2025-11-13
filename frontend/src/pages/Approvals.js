import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/App.css';

const Approvals = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('beneficiaries');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Pending items
    const [pendingBeneficiaries, setPendingBeneficiaries] = useState([]);
    const [pendingActivities, setPendingActivities] = useState([]);
    const [pendingPrograms, setPendingPrograms] = useState([]);

    // Selected items for viewing
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [reviewNotes, setReviewNotes] = useState('');

    useEffect(() => {
        fetchPendingItems();
    }, [activeTab]);

    const fetchPendingItems = async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            if (activeTab === 'beneficiaries') {
                const response = await fetch('/api/v1/beneficiaries?status=Pending Approval', { headers });
                const data = await response.json();
                if (data.success) {
                    setPendingBeneficiaries(data.data.beneficiaries || []);
                }
            } else if (activeTab === 'activities') {
                // TODO: Fetch pending activities when endpoint is created
                setPendingActivities([]);
            } else if (activeTab === 'programs') {
                const response = await fetch('/api/v1/programs?status=Pending Approval', { headers });
                const data = await response.json();
                if (data.success) {
                    setPendingPrograms(data.data.programs || []);
                }
            }
        } catch (err) {
            setError('Failed to load pending items');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleReview = (item, type) => {
        setSelectedItem({ ...item, type });
        setShowModal(true);
        setReviewNotes('');
    };

    const handleApprove = async () => {
        if (!selectedItem) return;

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            let endpoint = '';
            if (selectedItem.type === 'beneficiary') {
                endpoint = `/api/v1/beneficiaries/${selectedItem.beneficiary_id}`;
            } else if (selectedItem.type === 'activity') {
                endpoint = `/api/v1/activities/${selectedItem.activity_id}`;
            } else if (selectedItem.type === 'program') {
                endpoint = `/api/v1/programs/${selectedItem.program_id}`;
            }

            const response = await fetch(endpoint, {
                method: 'PUT',
                headers,
                body: JSON.stringify({
                    status: 'Active',
                    approval_notes: reviewNotes,
                    approved_at: new Date().toISOString(),
                    approved_by: JSON.parse(localStorage.getItem('user'))?.user_id
                })
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(`${selectedItem.type} approved successfully!`);
                setShowModal(false);
                setSelectedItem(null);
                fetchPendingItems();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.message || 'Failed to approve');
            }
        } catch (err) {
            setError('Failed to approve item');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        if (!selectedItem) return;
        if (!reviewNotes.trim()) {
            setError('Please provide rejection notes');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            let endpoint = '';
            if (selectedItem.type === 'beneficiary') {
                endpoint = `/api/v1/beneficiaries/${selectedItem.beneficiary_id}`;
            } else if (selectedItem.type === 'activity') {
                endpoint = `/api/v1/activities/${selectedItem.activity_id}`;
            } else if (selectedItem.type === 'program') {
                endpoint = `/api/v1/programs/${selectedItem.program_id}`;
            }

            const response = await fetch(endpoint, {
                method: 'PUT',
                headers,
                body: JSON.stringify({
                    status: 'Rejected',
                    rejection_notes: reviewNotes,
                    rejected_at: new Date().toISOString(),
                    rejected_by: JSON.parse(localStorage.getItem('user'))?.user_id
                })
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(`${selectedItem.type} rejected successfully!`);
                setShowModal(false);
                setSelectedItem(null);
                fetchPendingItems();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.message || 'Failed to reject');
            }
        } catch (err) {
            setError('Failed to reject item');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const renderBeneficiaryDetails = (beneficiary) => (
        <div className="approval-details">
            <div className="detail-section">
                <h4>Personal Information</h4>
                <div className="detail-grid">
                    <div className="detail-item">
                        <label>Registration Number:</label>
                        <span>{beneficiary.registration_number}</span>
                    </div>
                    <div className="detail-item">
                        <label>Full Name:</label>
                        <span>{`${beneficiary.first_name} ${beneficiary.middle_name || ''} ${beneficiary.last_name}`}</span>
                    </div>
                    <div className="detail-item">
                        <label>National ID:</label>
                        <span>{beneficiary.national_id}</span>
                    </div>
                    <div className="detail-item">
                        <label>Date of Birth:</label>
                        <span>{new Date(beneficiary.date_of_birth).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item">
                        <label>Gender:</label>
                        <span>{beneficiary.gender}</span>
                    </div>
                    <div className="detail-item">
                        <label>Phone:</label>
                        <span>{beneficiary.phone_number}</span>
                    </div>
                </div>
            </div>
            <div className="detail-section">
                <h4>Location</h4>
                <div className="detail-grid">
                    <div className="detail-item">
                        <label>County:</label>
                        <span>{beneficiary.county}</span>
                    </div>
                    <div className="detail-item">
                        <label>Sub-County:</label>
                        <span>{beneficiary.sub_county}</span>
                    </div>
                    <div className="detail-item">
                        <label>Ward:</label>
                        <span>{beneficiary.ward}</span>
                    </div>
                    <div className="detail-item">
                        <label>Village:</label>
                        <span>{beneficiary.village}</span>
                    </div>
                </div>
            </div>
            <div className="detail-section">
                <h4>Household Information</h4>
                <div className="detail-grid">
                    <div className="detail-item">
                        <label>Household Size:</label>
                        <span>{beneficiary.household_size}</span>
                    </div>
                    {beneficiary.monthly_income && (
                        <div className="detail-item">
                            <label>Monthly Income:</label>
                            <span>KES {parseInt(beneficiary.monthly_income).toLocaleString()}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderActivityDetails = (activity) => (
        <div className="approval-details">
            <div className="detail-section">
                <h4>Activity Information</h4>
                <div className="detail-grid">
                    <div className="detail-item">
                        <label>Activity Number:</label>
                        <span>{activity.activity_number}</span>
                    </div>
                    <div className="detail-item">
                        <label>Title:</label>
                        <span>{activity.activity_title}</span>
                    </div>
                    <div className="detail-item">
                        <label>Type:</label>
                        <span>{activity.activity_type}</span>
                    </div>
                    <div className="detail-item">
                        <label>Location:</label>
                        <span>{activity.location}</span>
                    </div>
                    <div className="detail-item">
                        <label>Start Date:</label>
                        <span>{new Date(activity.start_date).toLocaleDateString()}</span>
                    </div>
                    {activity.end_date && (
                        <div className="detail-item">
                            <label>End Date:</label>
                            <span>{new Date(activity.end_date).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="detail-section">
                <h4>Budget</h4>
                <div className="detail-grid">
                    <div className="detail-item">
                        <label>Planned Budget:</label>
                        <span>KES {parseFloat(activity.planned_budget || 0).toLocaleString()}</span>
                    </div>
                    <div className="detail-item">
                        <label>Target Participants:</label>
                        <span>{activity.planned_participants}</span>
                    </div>
                </div>
            </div>
            <div className="detail-section">
                <h4>Description</h4>
                <p>{activity.description}</p>
            </div>
        </div>
    );

    const renderProgramDetails = (program) => (
        <div className="approval-details">
            <div className="detail-section">
                <h4>Program Information</h4>
                <div className="detail-grid">
                    <div className="detail-item">
                        <label>Program Code:</label>
                        <span>{program.program_code}</span>
                    </div>
                    <div className="detail-item">
                        <label>Name:</label>
                        <span>{program.program_name}</span>
                    </div>
                    <div className="detail-item">
                        <label>Start Date:</label>
                        <span>{new Date(program.start_date).toLocaleDateString()}</span>
                    </div>
                    {program.end_date && (
                        <div className="detail-item">
                            <label>End Date:</label>
                            <span>{new Date(program.end_date).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="detail-section">
                <h4>Budget & Targets</h4>
                <div className="detail-grid">
                    <div className="detail-item">
                        <label>Total Budget:</label>
                        <span>KES {parseFloat(program.total_budget || 0).toLocaleString()}</span>
                    </div>
                    <div className="detail-item">
                        <label>Target Beneficiaries:</label>
                        <span>{program.target_beneficiaries}</span>
                    </div>
                </div>
            </div>
            <div className="detail-section">
                <h4>Description</h4>
                <p>{program.description}</p>
            </div>
        </div>
    );

    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-content">
                <Header />
                <div className="content-area">
                    {/* Page Header */}
                    <div className="page-header">
                        <div>
                            <h1>Approvals</h1>
                            <p className="breadcrumb">Home &gt; Approvals</p>
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

                    {/* Tabs */}
                    <div className="card" style={{ marginBottom: '20px' }}>
                        <div className="main-tabs">
                            <button
                                onClick={() => setActiveTab('beneficiaries')}
                                className={`main-tab ${activeTab === 'beneficiaries' ? 'active' : ''}`}
                            >
                                👥 Beneficiaries
                                {pendingBeneficiaries.length > 0 && (
                                    <span className="badge">{pendingBeneficiaries.length}</span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('activities')}
                                className={`main-tab ${activeTab === 'activities' ? 'active' : ''}`}
                            >
                                📝 Activities
                                {pendingActivities.length > 0 && (
                                    <span className="badge">{pendingActivities.length}</span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('programs')}
                                className={`main-tab ${activeTab === 'programs' ? 'active' : ''}`}
                            >
                                📁 Programs
                                {pendingPrograms.length > 0 && (
                                    <span className="badge">{pendingPrograms.length}</span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="card">
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <div className="spinner"></div>
                                <p>Loading pending items...</p>
                            </div>
                        ) : (
                            <>
                                {/* Beneficiaries Tab */}
                                {activeTab === 'beneficiaries' && (
                                    <>
                                        {pendingBeneficiaries.length === 0 ? (
                                            <div style={{ textAlign: 'center', padding: '60px' }}>
                                                <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
                                                <h3>No Pending Beneficiaries</h3>
                                                <p style={{ color: 'var(--text-secondary)' }}>
                                                    All beneficiaries have been reviewed
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="table-wrapper">
                                                <table className="data-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Registration #</th>
                                                            <th>Name</th>
                                                            <th>National ID</th>
                                                            <th>Location</th>
                                                            <th>Submitted Date</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {pendingBeneficiaries.map((beneficiary) => (
                                                            <tr key={beneficiary.beneficiary_id}>
                                                                <td>{beneficiary.registration_number}</td>
                                                                <td>
                                                                    {`${beneficiary.first_name} ${beneficiary.middle_name || ''} ${beneficiary.last_name}`}
                                                                </td>
                                                                <td>{beneficiary.national_id}</td>
                                                                <td>{beneficiary.county}</td>
                                                                <td>
                                                                    {new Date(beneficiary.registration_date).toLocaleDateString()}
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        className="btn btn-primary btn-sm"
                                                                        onClick={() => handleReview(beneficiary, 'beneficiary')}
                                                                    >
                                                                        Review
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Activities Tab */}
                                {activeTab === 'activities' && (
                                    <>
                                        {pendingActivities.length === 0 ? (
                                            <div style={{ textAlign: 'center', padding: '60px' }}>
                                                <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
                                                <h3>No Pending Activities</h3>
                                                <p style={{ color: 'var(--text-secondary)' }}>
                                                    All activities have been reviewed
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="table-wrapper">
                                                <table className="data-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Activity #</th>
                                                            <th>Title</th>
                                                            <th>Type</th>
                                                            <th>Location</th>
                                                            <th>Start Date</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {pendingActivities.map((activity) => (
                                                            <tr key={activity.activity_id}>
                                                                <td>{activity.activity_number}</td>
                                                                <td>{activity.activity_title}</td>
                                                                <td>{activity.activity_type}</td>
                                                                <td>{activity.location}</td>
                                                                <td>
                                                                    {new Date(activity.start_date).toLocaleDateString()}
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        className="btn btn-primary btn-sm"
                                                                        onClick={() => handleReview(activity, 'activity')}
                                                                    >
                                                                        Review
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Programs Tab */}
                                {activeTab === 'programs' && (
                                    <>
                                        {pendingPrograms.length === 0 ? (
                                            <div style={{ textAlign: 'center', padding: '60px' }}>
                                                <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
                                                <h3>No Pending Programs</h3>
                                                <p style={{ color: 'var(--text-secondary)' }}>
                                                    All programs have been reviewed
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="table-wrapper">
                                                <table className="data-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Program Code</th>
                                                            <th>Name</th>
                                                            <th>Category</th>
                                                            <th>Start Date</th>
                                                            <th>Budget</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {pendingPrograms.map((program) => (
                                                            <tr key={program.program_id}>
                                                                <td>{program.program_code}</td>
                                                                <td>{program.program_name}</td>
                                                                <td>{program.category?.category_name || 'N/A'}</td>
                                                                <td>
                                                                    {new Date(program.start_date).toLocaleDateString()}
                                                                </td>
                                                                <td>KES {parseFloat(program.total_budget || 0).toLocaleString()}</td>
                                                                <td>
                                                                    <button
                                                                        className="btn btn-primary btn-sm"
                                                                        onClick={() => handleReview(program, 'program')}
                                                                    >
                                                                        Review
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            {showModal && selectedItem && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Review {selectedItem.type}</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            {selectedItem.type === 'beneficiary' && renderBeneficiaryDetails(selectedItem)}
                            {selectedItem.type === 'activity' && renderActivityDetails(selectedItem)}
                            {selectedItem.type === 'program' && renderProgramDetails(selectedItem)}

                            <div className="form-section" style={{ marginTop: '20px' }}>
                                <label>Review Notes</label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    placeholder="Add notes about your decision (required for rejection)..."
                                    value={reviewNotes}
                                    onChange={(e) => setReviewNotes(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowModal(false)}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleReject}
                                disabled={loading}
                            >
                                {loading ? 'Rejecting...' : 'Reject'}
                            </button>
                            <button
                                className="btn btn-success"
                                onClick={handleApprove}
                                disabled={loading}
                            >
                                {loading ? 'Approving...' : 'Approve'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Approvals;
