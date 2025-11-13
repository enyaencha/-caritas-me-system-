# 🚀 QUICK START GUIDE
## Caritas Nairobi M&E System

---

## ⚡ 5-Minute Setup

### Step 1: Install PostgreSQL
Download from: https://www.postgresql.org/download/

### Step 2: Create Database
```bash
psql -U postgres
CREATE DATABASE caritas_me_system;
\q
```

### Step 3: Run Database Schema
```bash
cd database
psql -U postgres -d caritas_me_system -f schema.sql
```

### Step 4: Configure Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your database password
```

### Step 5: Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Step 6: Run Application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

---

## 🎯 Test the Application

1. Open browser: **http://localhost:3000**
2. Login with:
   - Username: `admin`
   - Password: `Admin@123`
3. Explore the dashboard!

---

## 🎨 What's Working

✅ Login page (matching mockup design)
✅ Dashboard with statistics
✅ Sidebar navigation
✅ User authentication
✅ Protected routes
✅ Complete API structure
✅ PostgreSQL database

---

## 📝 Common Commands

### Backend
```bash
npm run dev      # Start development server
npm start        # Start production server
```

### Frontend
```bash
npm start        # Start development server
npm run build    # Build for production
```

### Database
```bash
# Reset database
psql -U postgres -d caritas_me_system -f schema.sql
```

---

## 🔧 Troubleshooting

**Backend won't start?**
- Check PostgreSQL is running
- Verify .env database credentials
- Ensure port 5000 is available

**Frontend won't start?**
- Check Node.js version (v16+)
- Delete node_modules and reinstall
- Clear npm cache: `npm cache clean --force`

**Can't login?**
- Ensure backend is running
- Check browser console for errors
- Verify database has default admin user

---

## 📞 Need Help?

Check the main README.md for detailed documentation!

---

Happy Coding! 🎉
