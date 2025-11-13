import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/App.css';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const roles = ['Admin', 'M&E Officer', 'Program Manager', 'Data Entry', 'Viewer'];
    const statuses = ['Active', 'Inactive', 'Suspended'];

    // Fetch users
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (filterRole) params.append('role', filterRole);
            if (filterStatus) params.append('status', filterStatus);

            const response = await fetch(`/api/v1/users?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.success) {
                setUsers(data.data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        }
    }, [activeTab, searchTerm, filterRole, filterStatus]);

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/v1/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.success) {
                alert('User deleted successfully');
                fetchUsers();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error deleting user');
        }
    };

    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-content">
                <Header
                    title="Settings"
                    breadcrumb="Home > Settings > User Management"
                />

                <div className="content-area">
                    {/* Settings Tabs */}
                    <div className="card" style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', gap: '20px', borderBottom: '2px solid #ecf0f1' }}>
                            <button
                                onClick={() => setActiveTab('users')}
                                style={{
                                    padding: '15px 25px',
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                    fontWeight: activeTab === 'users' ? 'bold' : 'normal',
                                    borderBottom: activeTab === 'users' ? '3px solid #3498db' : 'none',
                                    color: activeTab === 'users' ? '#3498db' : '#7f8c8d'
                                }}
                            >
                                👥 User Management
                            </button>
                            <button
                                onClick={() => setActiveTab('system')}
                                style={{
                                    padding: '15px 25px',
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                    fontWeight: activeTab === 'system' ? 'bold' : 'normal',
                                    borderBottom: activeTab === 'system' ? '3px solid #3498db' : 'none',
                                    color: activeTab === 'system' ? '#3498db' : '#7f8c8d'
                                }}
                            >
                                ⚙️ System Settings
                            </button>
                        </div>
                    </div>

                    {/* User Management Tab */}
                    {activeTab === 'users' && (
                        <>
                            {/* Filters and Actions */}
                            <div className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                                    <div style={{ display: 'flex', gap: '10px', flex: 1, flexWrap: 'wrap' }}>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="🔍 Search users..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            style={{ minWidth: '200px' }}
                                        />

                                        <select
                                            className="form-select"
                                            value={filterRole}
                                            onChange={(e) => setFilterRole(e.target.value)}
                                            style={{ minWidth: '150px' }}
                                        >
                                            <option value="">All Roles</option>
                                            {roles.map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>

                                        <select
                                            className="form-select"
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                            style={{ minWidth: '150px' }}
                                        >
                                            <option value="">All Status</option>
                                            {statuses.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setShowAddModal(true)}
                                    >
                                        ➕ Add New User
                                    </button>
                                </div>

                                {/* Users Table */}
                                <div className="table-wrapper">
                                    {loading ? (
                                        <div style={{ textAlign: 'center', padding: '40px' }}>
                                            Loading users...
                                        </div>
                                    ) : (
                                        <table className="data-table">
                                            <thead>
                                            <tr>
                                                <th>Username</th>
                                                <th>Full Name</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Role</th>
                                                <th>Status</th>
                                                <th>Last Login</th>
                                                <th>Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {users.length === 0 ? (
                                                <tr>
                                                    <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                                                        No users found
                                                    </td>
                                                </tr>
                                            ) : (
                                                users.map(user => (
                                                    <tr key={user.user_id}>
                                                        <td style={{ fontWeight: 'bold' }}>{user.username}</td>
                                                        <td>{user.first_name} {user.last_name}</td>
                                                        <td>{user.email}</td>
                                                        <td>{user.phone_number || '-'}</td>
                                                        <td>
                                                                <span style={{
                                                                    padding: '4px 8px',
                                                                    borderRadius: '4px',
                                                                    fontSize: '12px',
                                                                    background: '#ecf0f1',
                                                                    color: '#2c3e50'
                                                                }}>
                                                                    {user.role}
                                                                </span>
                                                        </td>
                                                        <td>
                                                                <span className={`status-badge status-${user.status.toLowerCase()}`}>
                                                                    {user.status}
                                                                </span>
                                                        </td>
                                                        <td>
                                                            {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                                                        </td>
                                                        <td>
                                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                                <button
                                                                    className="btn btn-sm"
                                                                    onClick={() => {
                                                                        setSelectedUser(user);
                                                                        setShowEditModal(true);
                                                                    }}
                                                                    title="Edit"
                                                                >
                                                                    ✏️
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm"
                                                                    onClick={() => handleDeleteUser(user.user_id)}
                                                                    title="Delete"
                                                                    style={{ background: '#e74c3c', color: 'white' }}
                                                                >
                                                                    🗑️
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* System Settings Tab */}
                    {activeTab === 'system' && (
                        <div className="card">
                            <h3>⚙️ System Settings</h3>
                            <p style={{ color: '#7f8c8d', marginTop: '10px' }}>
                                Coming soon! System configuration options will appear here.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <AddUserModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        setShowAddModal(false);
                        fetchUsers();
                    }}
                    roles={roles}
                />
            )}

            {/* Edit User Modal */}
            {showEditModal && selectedUser && (
                <EditUserModal
                    user={selectedUser}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedUser(null);
                    }}
                    onSuccess={() => {
                        setShowEditModal(false);
                        setSelectedUser(null);
                        fetchUsers();
                    }}
                    roles={roles}
                    statuses={statuses}
                />
            )}
        </div>
    );
};

// Add User Modal Component
const AddUserModal = ({ onClose, onSuccess, roles }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        role: 'Data Entry'
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/v1/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                alert('User created successfully!');
                onSuccess();
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Error creating user');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'white',
                padding: '30px',
                borderRadius: '8px',
                width: '90%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflow: 'auto'
            }}>
                <h2 style={{ marginBottom: '20px' }}>➕ Add New User</h2>

                {error && (
                    <div style={{
                        padding: '10px',
                        background: 'rgba(231, 76, 60, 0.1)',
                        color: '#e74c3c',
                        borderRadius: '4px',
                        marginBottom: '15px'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div className="form-group">
                            <label className="form-label">Username *</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email *</label>
                            <input
                                type="email"
                                className="form-input"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">First Name *</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.first_name}
                                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Last Name *</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.last_name}
                                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input
                                type="tel"
                                className="form-input"
                                value={formData.phone_number}
                                onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Role *</label>
                            <select
                                className="form-select"
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                                required
                            >
                                {roles.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">Password *</label>
                            <input
                                type="password"
                                className="form-input"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                required
                                minLength="6"
                            />
                            <small style={{ color: '#7f8c8d' }}>Minimum 6 characters</small>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? 'Creating...' : '✅ Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Edit User Modal Component
const EditUserModal = ({ user, onClose, onSuccess, roles, statuses }) => {
    const [formData, setFormData] = useState({
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number || '',
        role: user.role,
        status: user.status
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/v1/users/${user.user_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                alert('User updated successfully!');
                onSuccess();
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Error updating user');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'white',
                padding: '30px',
                borderRadius: '8px',
                width: '90%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflow: 'auto'
            }}>
                <h2 style={{ marginBottom: '20px' }}>✏️ Edit User</h2>

                {error && (
                    <div style={{
                        padding: '10px',
                        background: 'rgba(231, 76, 60, 0.1)',
                        color: '#e74c3c',
                        borderRadius: '4px',
                        marginBottom: '15px'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div className="form-group">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-input"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">First Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.first_name}
                                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Last Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.last_name}
                                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input
                                type="tel"
                                className="form-input"
                                value={formData.phone_number}
                                onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Role</label>
                            <select
                                className="form-select"
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                                required
                            >
                                {roles.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">Status</label>
                            <select
                                className="form-select"
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                                required
                            >
                                {statuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? 'Updating...' : '💾 Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;