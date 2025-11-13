import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/App.css';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { path: '/dashboard', icon: '📊', label: 'Dashboard', id: 'dashboard' },
        { path: '/data-entry', icon: '📝', label: 'Data Entry', id: 'data-entry' },
        { path: '/beneficiaries', icon: '👥', label: 'Beneficiaries', id: 'beneficiaries' },
        { path: '/programs', icon: '📁', label: 'Programs', id: 'programs' },
        { path: '/activities', icon: '📋', label: 'Activities', id: 'activities' },
        { path: '/approvals', icon: '✅', label: 'Approvals', id: 'approvals' },
        { path: '/reports', icon: '📈', label: 'Reports', id: 'reports' },
        { path: '/analytics', icon: '📉', label: 'Analytics', id: 'analytics' },
        { path: '/settings', icon: '⚙️', label: 'Settings', id: 'settings' }
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>🏥 Caritas Nairobi</h2>
                <p>M&E System</p>
            </div>

            <div className="menu-section">
                {menuItems.map((item) => (
                    <Link
                        key={item.id}
                        to={item.path}
                        className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
                        style={{ textDecoration: 'none' }}
                    >
                        <span className="menu-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}

                <div 
                    className="menu-item" 
                    onClick={handleLogout}
                    style={{ marginTop: '30px', cursor: 'pointer' }}
                >
                    <span className="menu-icon">🚪</span>
                    <span>Logout</span>
                </div>
            </div>

            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '0',
                right: '0',
                padding: '0 20px',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.5)',
                textAlign: 'center'
            }}>
                Version 1.0.0<br/>
                © 2025 Caritas Nairobi
            </div>
        </div>
    );
};

export default Sidebar;
