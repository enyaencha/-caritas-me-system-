import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/App.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalBeneficiaries: 0,
        activePrograms: 0,
        completedActivities: 0,
        pendingApprovals: 0
    });

    useEffect(() => {
        // Fetch dashboard stats from API
        // For now, using mock data
        setStats({
            totalBeneficiaries: 2847,
            activePrograms: 24,
            completedActivities: 156,
            pendingApprovals: 12
        });
    }, []);

    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-content">
                <Header 
                    title="Dashboard" 
                    breadcrumb="Home > Dashboard > Overview"
                />
                
                <div className="content-area">
                    {/* Stats Cards */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon blue">
                                👥
                            </div>
                            <div className="stat-details">
                                <h3>{stats.totalBeneficiaries.toLocaleString()}</h3>
                                <p>Total Beneficiaries</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon green">
                                📊
                            </div>
                            <div className="stat-details">
                                <h3>{stats.activePrograms}</h3>
                                <p>Active Programs</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon orange">
                                ✅
                            </div>
                            <div className="stat-details">
                                <h3>{stats.completedActivities}</h3>
                                <p>Completed Activities</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon purple">
                                ⏳
                            </div>
                            <div className="stat-details">
                                <h3>{stats.pendingApprovals}</h3>
                                <p>Pending Approvals</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">📋 Recent Activities</h3>
                            <button className="btn btn-primary btn-sm">View All</button>
                        </div>
                        
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Activity ID</th>
                                        <th>Activity Name</th>
                                        <th>Program</th>
                                        <th>Date</th>
                                        <th>Participants</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>#ACT-2025-256</td>
                                        <td>Youth Skills Training</td>
                                        <td>Gender & Youth</td>
                                        <td>Nov 10, 2025</td>
                                        <td>45</td>
                                        <td><span className="status-badge status-completed">Completed</span></td>
                                        <td>
                                            <button className="btn btn-sm" title="View">👁️</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>#ACT-2025-255</td>
                                        <td>Peace Dialogue Forum</td>
                                        <td>Peace Building</td>
                                        <td>Nov 9, 2025</td>
                                        <td>120</td>
                                        <td><span className="status-badge status-pending">Pending Approval</span></td>
                                        <td>
                                            <button className="btn btn-sm" title="View">👁️</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>#ACT-2025-254</td>
                                        <td>Food Distribution</td>
                                        <td>Relief Services</td>
                                        <td>Nov 8, 2025</td>
                                        <td>350</td>
                                        <td><span className="status-badge status-completed">Completed</span></td>
                                        <td>
                                            <button className="btn btn-sm" title="View">👁️</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>#ACT-2025-253</td>
                                        <td>Livelihood Training</td>
                                        <td>Socio-Economic</td>
                                        <td>Nov 7, 2025</td>
                                        <td>60</td>
                                        <td><span className="status-badge status-active">In Progress</span></td>
                                        <td>
                                            <button className="btn btn-sm" title="View">👁️</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">⚡ Quick Actions</h3>
                        </div>
                        
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                            gap: '15px' 
                        }}>
                            <button className="btn btn-primary" style={{ justifyContent: 'center', padding: '15px' }}>
                                ➕ New Beneficiary
                            </button>
                            <button className="btn btn-success" style={{ justifyContent: 'center', padding: '15px' }}>
                                📝 Log Activity
                            </button>
                            <button className="btn btn-warning" style={{ justifyContent: 'center', padding: '15px' }}>
                                📊 Generate Report
                            </button>
                            <button className="btn btn-secondary" style={{ justifyContent: 'center', padding: '15px' }}>
                                👁️ View Analytics
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
