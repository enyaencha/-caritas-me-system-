// =====================================================
// PROGRAM CATEGORY MANAGER COMPONENT (Admin Only)
// =====================================================

import React, { useState } from 'react';
import { programAPI } from '../services/api';

const CategoryManager = ({ categories, onCategoryAdded }) => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        category_name: '',
        description: '',
        color_code: '#3B82F6'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Get current user from localStorage
    const getCurrentUser = () => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (e) {
                return null;
            }
        }
        return null;
    };

    const user = getCurrentUser();
    const isAdmin = user && user.role === 'Admin';

    // If not admin, don't show anything
    if (!isAdmin) {
        return null;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await programAPI.createCategory(formData);

            if (response.data.success) {
                // Reset form
                setFormData({
                    category_name: '',
                    description: '',
                    color_code: '#3B82F6'
                });
                setShowModal(false);

                // Notify parent to refresh categories
                if (onCategoryAdded) {
                    onCategoryAdded();
                }

                alert('Program category created successfully!');
            }
        } catch (err) {
            console.error('Error creating category:', err);
            setError(
                err.response?.data?.message ||
                'Failed to create category. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Add Category Button */}
            <button
                className="btn btn-secondary"
                onClick={() => setShowModal(true)}
                style={{ marginLeft: '10px' }}
            >
                + Add Category
            </button>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                        style={{ maxWidth: '500px' }}
                    >
                        <div className="modal-header">
                            <h2>Add New Program Category</h2>
                            <button
                                className="modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                {error && (
                                    <div className="alert alert-danger" style={{ marginBottom: '15px' }}>
                                        {error}
                                    </div>
                                )}

                                <div className="form-group">
                                    <label>Category Name *</label>
                                    <input
                                        type="text"
                                        name="category_name"
                                        className="form-control"
                                        value={formData.category_name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g., Education & Training"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        name="description"
                                        className="form-control"
                                        rows="3"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Brief description of this category"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Color Code</label>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <input
                                            type="color"
                                            name="color_code"
                                            className="form-control"
                                            value={formData.color_code}
                                            onChange={handleInputChange}
                                            style={{ width: '60px', height: '40px' }}
                                        />
                                        <input
                                            type="text"
                                            value={formData.color_code}
                                            onChange={(e) => setFormData(prev => ({ ...prev, color_code: e.target.value }))}
                                            className="form-control"
                                            placeholder="#3B82F6"
                                            pattern="^#[0-9A-Fa-f]{6}$"
                                        />
                                    </div>
                                    <small style={{ color: '#7f8c8d' }}>
                                        Choose a color to identify this category
                                    </small>
                                </div>

                                <div className="alert alert-info" style={{ marginTop: '15px' }}>
                                    <strong>Current Categories:</strong>
                                    <ul style={{ marginTop: '5px', marginBottom: '0', paddingLeft: '20px' }}>
                                        {categories.map(cat => (
                                            <li key={cat.category_id}>
                                                <span
                                                    style={{
                                                        display: 'inline-block',
                                                        width: '12px',
                                                        height: '12px',
                                                        borderRadius: '50%',
                                                        backgroundColor: cat.color_code,
                                                        marginRight: '8px'
                                                    }}
                                                />
                                                {cat.category_name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Creating...' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default CategoryManager;
