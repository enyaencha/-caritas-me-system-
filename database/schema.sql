-- =====================================================
-- CARITAS NAIROBI M&E SYSTEM - DATABASE SCHEMA
-- PostgreSQL Database Schema
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USER MANAGEMENT & AUTHENTICATION
-- =====================================================

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'M&E Officer', 'Program Manager', 'Data Entry', 'Viewer')),
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Suspended')),
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(user_id),
    profile_image VARCHAR(255)
);

CREATE TABLE user_sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    ip_address VARCHAR(50),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. BENEFICIARY MANAGEMENT
-- =====================================================

CREATE TABLE beneficiaries (
    beneficiary_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    national_id VARCHAR(50),
    phone_number VARCHAR(20),
    email VARCHAR(100),
    marital_status VARCHAR(30) CHECK (marital_status IN ('Single', 'Married', 'Divorced', 'Widowed', 'Separated')),
    education_level VARCHAR(50),
    occupation VARCHAR(100),
    disability_status VARCHAR(50),
    household_size INTEGER,
    monthly_income DECIMAL(12,2),
    registration_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Deceased', 'Relocated')),
    photo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(user_id)
);

CREATE TABLE beneficiary_addresses (
    address_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beneficiary_id UUID REFERENCES beneficiaries(beneficiary_id) ON DELETE CASCADE,
    address_type VARCHAR(30) DEFAULT 'Residential',
    county VARCHAR(100) NOT NULL,
    sub_county VARCHAR(100),
    ward VARCHAR(100),
    village VARCHAR(100),
    postal_address VARCHAR(200),
    gps_latitude DECIMAL(10,8),
    gps_longitude DECIMAL(11,8),
    is_primary BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE beneficiary_documents (
    document_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beneficiary_id UUID REFERENCES beneficiaries(beneficiary_id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    document_name VARCHAR(200) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by UUID REFERENCES users(user_id)
);

-- =====================================================
-- 3. PROGRAM MANAGEMENT
-- =====================================================

CREATE TABLE program_categories (
    category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_code VARCHAR(50) UNIQUE NOT NULL,
    category_name VARCHAR(200) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE programs (
    program_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_code VARCHAR(50) UNIQUE NOT NULL,
    program_name VARCHAR(200) NOT NULL,
    category_id UUID REFERENCES program_categories(category_id),
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    budget DECIMAL(15,2),
    funding_source VARCHAR(200),
    program_manager UUID REFERENCES users(user_id),
    status VARCHAR(30) DEFAULT 'Active' CHECK (status IN ('Planning', 'Active', 'Completed', 'Suspended', 'Closed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(user_id)
);

CREATE TABLE program_indicators (
    indicator_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES programs(program_id) ON DELETE CASCADE,
    indicator_code VARCHAR(50) NOT NULL,
    indicator_name VARCHAR(300) NOT NULL,
    indicator_type VARCHAR(50) CHECK (indicator_type IN ('Input', 'Output', 'Outcome', 'Impact')),
    measurement_unit VARCHAR(50),
    baseline_value DECIMAL(12,2),
    target_value DECIMAL(12,2),
    current_value DECIMAL(12,2),
    data_source VARCHAR(200),
    frequency VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. ACTIVITY MANAGEMENT
-- =====================================================

CREATE TABLE activities (
    activity_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_number VARCHAR(50) UNIQUE NOT NULL,
    program_id UUID REFERENCES programs(program_id),
    activity_title VARCHAR(300) NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(200),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    planned_participants INTEGER,
    actual_participants INTEGER,
    planned_budget DECIMAL(12,2),
    actual_budget DECIMAL(12,2),
    status VARCHAR(30) DEFAULT 'Planned' CHECK (status IN ('Planned', 'In Progress', 'Completed', 'Cancelled', 'Pending Approval', 'Approved', 'Rejected')),
    priority VARCHAR(20) CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    submission_date TIMESTAMP,
    approval_date TIMESTAMP,
    approved_by UUID REFERENCES users(user_id),
    approval_comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(user_id)
);

CREATE TABLE activity_beneficiaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID REFERENCES activities(activity_id) ON DELETE CASCADE,
    beneficiary_id UUID REFERENCES beneficiaries(beneficiary_id) ON DELETE CASCADE,
    attendance_status VARCHAR(30) CHECK (attendance_status IN ('Present', 'Absent', 'Late', 'Excused')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(activity_id, beneficiary_id)
);

CREATE TABLE activity_outputs (
    output_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID REFERENCES activities(activity_id) ON DELETE CASCADE,
    output_description TEXT NOT NULL,
    planned_quantity DECIMAL(12,2),
    achieved_quantity DECIMAL(12,2),
    measurement_unit VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activity_outcomes (
    outcome_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID REFERENCES activities(activity_id) ON DELETE CASCADE,
    outcome_description TEXT NOT NULL,
    indicator_id UUID REFERENCES program_indicators(indicator_id),
    achieved_value DECIMAL(12,2),
    measurement_unit VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activity_resources (
    resource_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID REFERENCES activities(activity_id) ON DELETE CASCADE,
    resource_type VARCHAR(100) NOT NULL,
    resource_name VARCHAR(200) NOT NULL,
    quantity DECIMAL(12,2),
    unit_cost DECIMAL(12,2),
    total_cost DECIMAL(12,2),
    supplier VARCHAR(200),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activity_attachments (
    attachment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID REFERENCES activities(activity_id) ON DELETE CASCADE,
    file_name VARCHAR(200) NOT NULL,
    file_type VARCHAR(50),
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    description TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by UUID REFERENCES users(user_id)
);

-- =====================================================
-- 5. REPORTS & ANALYTICS
-- =====================================================

CREATE TABLE report_templates (
    template_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_name VARCHAR(200) NOT NULL,
    report_type VARCHAR(100) NOT NULL,
    description TEXT,
    query_config JSONB,
    layout_config JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(user_id)
);

CREATE TABLE generated_reports (
    report_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID REFERENCES report_templates(template_id),
    report_name VARCHAR(200) NOT NULL,
    report_type VARCHAR(100),
    parameters JSONB,
    file_path VARCHAR(500),
    file_format VARCHAR(20),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    generated_by UUID REFERENCES users(user_id)
);

-- =====================================================
-- 6. SYSTEM SETTINGS
-- =====================================================

CREATE TABLE system_settings (
    setting_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50),
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(user_id)
);

CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

CREATE INDEX idx_beneficiaries_registration ON beneficiaries(registration_number);
CREATE INDEX idx_beneficiaries_national_id ON beneficiaries(national_id);
CREATE INDEX idx_beneficiaries_status ON beneficiaries(status);

CREATE INDEX idx_activities_program ON activities(program_id);
CREATE INDEX idx_activities_status ON activities(status);
CREATE INDEX idx_activities_dates ON activities(start_date, end_date);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- =====================================================
-- DEFAULT DATA INSERTS
-- =====================================================

-- Default Admin User (password: Admin@123)
INSERT INTO users (username, email, password_hash, first_name, last_name, role, status)
VALUES ('admin', 'admin@caritas.org', '$2b$10$rBV2rXUzQz5FKEOwYzQ0/.xE5p9/vQBQ5hPZfZx7y7Kt6bV/pZZKG', 'System', 'Administrator', 'Admin', 'Active');

-- Program Categories
INSERT INTO program_categories (category_code, category_name, description, icon, color) VALUES
('PEACE', 'Peace Building & Cohesion', 'Programs promoting peace and community cohesion', '🕊️', '#3498db'),
('CAPACITY', 'Capacity Building', 'Training and skill development programs', '📚', '#9b59b6'),
('FOOD', 'Food & Environment', 'Food security and environmental programs', '🌱', '#27ae60'),
('SOCIO', 'Socio-Economic', 'Economic empowerment and livelihoods', '💼', '#f39c12'),
('GENDER', 'Gender & Youth', 'Gender equality and youth development', '👥', '#e74c3c'),
('RELIEF', 'Relief Services', 'Emergency relief and charitable services', '🆘', '#e67e22');

-- System Settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('system_name', 'Caritas Nairobi M&E System', 'text', 'System name'),
('organization', 'Caritas Nairobi', 'text', 'Organization name'),
('timezone', 'Africa/Nairobi', 'text', 'System timezone'),
('date_format', 'DD/MM/YYYY', 'text', 'Date display format'),
('currency', 'KES', 'text', 'Default currency');
