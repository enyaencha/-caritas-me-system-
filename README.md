# 🏥 Caritas Nairobi M&E System

Complete **Monitoring & Evaluation System** with React frontend and Node.js/Express backend, matching the 42-screen mockup design.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Default Credentials](#default-credentials)
- [Screenshots](#screenshots)

---

## ✨ Features

### MVP Phase 1 (Current Implementation)
- ✅ **User Authentication** - Login with JWT tokens
- ✅ **Dashboard** - Overview with statistics and recent activities
- ✅ **Responsive UI** - Matching your 42-screen mockup design
- ✅ **Role-Based Access** - Admin, M&E Officer, Program Manager, etc.
- ✅ **RESTful API** - Complete backend with Express.js
- ✅ **PostgreSQL Database** - Comprehensive schema with all tables

### Coming Soon (Ready for Development)
- 🔜 Beneficiary Management
- 🔜 Program Management
- 🔜 Activity Logging (6-tab form)
- 🔜 Approval Workflows
- 🔜 Reports & Analytics
- 🔜 File Upload & Management

---

## 🛠 Tech Stack

### Frontend
- **React** 18.2.0 - UI framework
- **React Router** 6.20.0 - Routing
- **Axios** - API requests
- **CSS3** - Custom styling matching mockup

### Backend
- **Node.js** - Runtime environment
- **Express** 4.18.2 - Web framework
- **Sequelize** 6.35.0 - ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v13 or higher) - [Download](https://www.postgresql.org/)
- **npm** or **yarn** - Comes with Node.js

---

## 🚀 Installation

### 1. Clone or Extract the Project

```bash
cd caritas-me-system
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## ⚙️ Configuration

### 1. Create PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE caritas_me_system;

# Exit
\q
```

### 2. Run Database Schema

```bash
cd ../database
psql -U postgres -d caritas_me_system -f schema.sql
```

### 3. Configure Backend Environment

```bash
cd ../backend
cp .env.example .env
```

Edit `.env` file with your settings:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=caritas_me_system
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Secret (Change in production!)
JWT_SECRET=your_super_secret_jwt_key_change_this

# Server
PORT=5000
NODE_ENV=development

# Frontend URL
CORS_ORIGIN=http://localhost:3000
```

---

## 🎯 Running the Application

### Option 1: Run Separately (Recommended for Development)

#### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
```
Server will run on: **http://localhost:5000**

#### Terminal 2 - Frontend App
```bash
cd frontend
npm start
```
App will open on: **http://localhost:3000**

### Option 2: Production Build

```bash
# Build frontend
cd frontend
npm run build

# Serve frontend from backend (configure Express static)
cd ../backend
npm start
```

---

## 📁 Project Structure

```
caritas-me-system/
│
├── backend/                    # Node.js/Express API
│   ├── config/                # Database configuration
│   │   └── database.js
│   ├── models/                # Sequelize models
│   │   ├── User.js
│   │   └── Beneficiary.js
│   ├── routes/                # API routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   └── ...
│   ├── controllers/           # Request handlers
│   │   └── auth.controller.js
│   ├── middleware/            # Custom middleware
│   │   └── auth.js
│   ├── utils/                 # Utility functions
│   │   └── jwt.js
│   ├── server.js              # Main server file
│   ├── package.json
│   └── .env.example
│
├── frontend/                  # React Application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── Sidebar.js
│   │   │   └── Header.js
│   │   ├── pages/            # Page components
│   │   │   ├── Login.js
│   │   │   └── Dashboard.js
│   │   ├── styles/           # CSS files
│   │   │   └── App.css
│   │   ├── App.js            # Main app component
│   │   └── index.js          # Entry point
│   └── package.json
│
├── database/                  # Database files
│   └── schema.sql            # PostgreSQL schema
│
├── docs/                      # Documentation
│   └── README.md
│
└── README.md                  # This file
```

---

## 🔌 API Documentation

### Authentication Endpoints

#### POST /api/v1/auth/login
Login user and get JWT token

**Request:**
```json
{
    "username": "admin",
    "password": "Admin@123"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": { ... },
        "accessToken": "eyJhbGc...",
        "refreshToken": "eyJhbGc..."
    }
}
```

#### GET /api/v1/auth/me
Get current logged-in user (Protected)

**Headers:**
```
Authorization: Bearer {token}
```

#### PUT /api/v1/auth/change-password
Change user password (Protected)

**Request:**
```json
{
    "currentPassword": "old_password",
    "newPassword": "new_password"
}
```

### Health Check

#### GET /health
Check if API is running

---

## 🔐 Default Credentials

For testing purposes, the system comes with a default admin account:

```
Username: admin
Email: admin@caritas.org
Password: Admin@123
```

**⚠️ IMPORTANT:** Change this password immediately in production!

---

## 🎨 UI Design

The frontend matches your **42-screen mockup** design with:

- ✅ Exact color scheme (blues, greens, purples)
- ✅ Icon usage matching mockup
- ✅ Sidebar navigation
- ✅ Dashboard cards and stats
- ✅ Tables with status badges
- ✅ Forms with validation
- ✅ Responsive design

---

## 🚦 Current Status

### ✅ Completed (MVP Phase 1)
- Database schema (all tables)
- User authentication system
- Login page
- Dashboard with stats
- Sidebar navigation
- Header component
- API structure and endpoints
- JWT token management
- Protected routes

### 🔜 Next Steps (Phase 2)
1. **Beneficiary Module**
   - Registration form
   - List view with search/filter
   - Details view
   - Edit functionality

2. **Activity Module**
   - 6-tab activity entry form
   - Activity list
   - Approval workflow

3. **Reports Module**
   - Report generation
   - Export to PDF/Excel
   - Custom filters

---

## 🛡️ Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Role-based access control
- ✅ Helmet.js for HTTP headers
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Input validation

---

## 🐛 Troubleshooting

### Database Connection Error
```
Error: Unable to connect to database
```
**Solution:** Check your PostgreSQL is running and .env credentials are correct

### Port Already in Use
```
Error: Port 5000 is already in use
```
**Solution:** Change PORT in .env or kill the process using that port

### CORS Error in Browser
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution:** Ensure CORS_ORIGIN in .env matches your frontend URL

---

## 📞 Support

For questions or issues, contact your development team or refer to the documentation.

---

## 📄 License

© 2025 Caritas Nairobi. All rights reserved.

---

## 🎯 Next Development Phase

Ready to continue development? Here's what to build next:

1. **Create Beneficiary Registration Page**
   - Multi-step form
   - Photo upload
   - Address fields
   - Document attachments

2. **Build Activity Logging Module**
   - Implement all 6 tabs from mockup
   - Participant selection
   - Resource tracking
   - Outcomes recording

3. **Implement Approval System**
   - Approval dashboard
   - Review interface
   - Notification system

Want to start with any of these? Let me know! 🚀
