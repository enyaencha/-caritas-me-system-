import React from 'react';
import '../styles/App.css';

const Header = ({ title, breadcrumb }) => {
    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userInitials = user.first_name && user.last_name 
        ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
        : 'U';

    return (
        <div className="header">
            <div>
                <h1>{title}</h1>
                {breadcrumb && <div className="breadcrumb">{breadcrumb}</div>}
            </div>

            <div className="user-profile">
                <div style={{ textAlign: 'right', marginRight: '10px' }}>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>
                        {user.first_name} {user.last_name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                        {user.role}
                    </div>
                </div>
                <div className="user-avatar">
                    {userInitials}
                </div>
            </div>
        </div>
    );
};

export default Header;
