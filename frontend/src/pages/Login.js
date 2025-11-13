import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(''); // Clear error on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                // Store token
                localStorage.setItem('token', data.data.accessToken);
                localStorage.setItem('user', JSON.stringify(data.data.user));
                
                // Redirect to dashboard
                navigate('/dashboard');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Network error. Please check your connection.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-logo">
                    <h1>🏥 Caritas Nairobi</h1>
                    <p>Monitoring & Evaluation System</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{
                            padding: '10px 15px',
                            background: 'rgba(231, 76, 60, 0.1)',
                            color: '#e74c3c',
                            borderRadius: '4px',
                            marginBottom: '15px',
                            fontSize: '13px'
                        }}>
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">
                            👤 Username or Email
                        </label>
                        <input
                            type="text"
                            name="username"
                            className="form-input"
                            placeholder="Enter your username or email"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            🔒 Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            className="form-input"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '20px',
                        fontSize: '13px'
                    }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <input type="checkbox" />
                            <span>Remember me</span>
                        </label>
                        <a href="#forgot" style={{ color: '#3498db', textDecoration: 'none' }}>
                            Forgot Password?
                        </a>
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                        disabled={loading}
                    >
                        {loading ? '⏳ Signing in...' : '🚀 Sign In'}
                    </button>
                </form>

                <div style={{ 
                    marginTop: '20px', 
                    textAlign: 'center',
                    fontSize: '12px',
                    color: '#7f8c8d'
                }}>
                    <p>Default credentials for testing:</p>
                    <p style={{ fontFamily: 'monospace', marginTop: '5px' }}>
                        Username: <strong>admin</strong> | Password: <strong>Admin@123</strong>
                    </p>
                </div>
            </div>

            <div style={{
                position: 'absolute',
                bottom: '20px',
                textAlign: 'center',
                width: '100%',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '12px'
            }}>
                © 2025 Caritas Nairobi. All rights reserved.
            </div>
        </div>
    );
};

export default Login;
