// =====================================================
// API SERVICE
// =====================================================

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// =====================================================
// BENEFICIARY API
// =====================================================

export const beneficiaryAPI = {
    // Get all beneficiaries with filters
    getAll: (params) => api.get('/beneficiaries', { params }),

    // Get beneficiary by ID
    getById: (id) => api.get(`/beneficiaries/${id}`),

    // Create new beneficiary
    create: (data) => api.post('/beneficiaries', data),

    // Update beneficiary
    update: (id, data) => api.put(`/beneficiaries/${id}`, data),

    // Delete beneficiary
    delete: (id) => api.delete(`/beneficiaries/${id}`),

    // Get statistics
    getStats: () => api.get('/beneficiaries/stats/summary'),

    // Upload photo
    uploadPhoto: (id, formData) => {
        return api.post(`/beneficiaries/${id}/photo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
};

// =====================================================
// PROGRAM API
// =====================================================

export const programAPI = {
    // Get all programs with filters
    getAll: (params) => api.get('/programs', { params }),

    // Get program by ID
    getById: (id) => api.get(`/programs/${id}`),

    // Create new program
    create: (data) => api.post('/programs', data),

    // Update program
    update: (id, data) => api.put(`/programs/${id}`, data),

    // Delete program
    delete: (id) => api.delete(`/programs/${id}`),

    // Get statistics
    getStats: () => api.get('/programs/stats/summary'),

    // Category operations
    getCategories: () => api.get('/programs/categories'),
    createCategory: (data) => api.post('/programs/categories', data),

    // Indicator operations
    addIndicator: (programId, data) => api.post(`/programs/${programId}/indicators`, data),
    updateIndicator: (indicatorId, data) => api.put(`/programs/indicators/${indicatorId}`, data),
    deleteIndicator: (indicatorId) => api.delete(`/programs/indicators/${indicatorId}`)
};

// =====================================================
// AUTH API
// =====================================================

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => api.post('/auth/logout'),
    getMe: () => api.get('/auth/me'),
    changePassword: (data) => api.put('/auth/change-password', data)
};

// =====================================================
// DASHBOARD API
// =====================================================

export const dashboardAPI = {
    getStats: () => api.get('/dashboard/stats'),
    getRecentActivities: () => api.get('/dashboard/recent-activities')
};

export default api;
