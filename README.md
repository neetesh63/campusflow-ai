# CampusFlow AI - Smart Campus Management Platform

> **Tagline**: *"Next-Generation AI Powered Campus Flow for Universities & Colleges"*

CampusFlow AI is an end-to-end intelligent campus management platform that connects **Students**, **Faculty Members**, and **Administrators** into a unified digital ecosystem. Designed for college semester projects, IBM internship submissions, and production deployment, it streamlines attendance tracking, assignment submissions, campus circulars, event management, complaint ticketing, lost & found reporting, and personalized **Google Gemini AI Study Roadmaps**.

---

## 📂 Project Folder Structure & Overview

```text
campusflow-ai/
│
├── frontend/                     # React 19 Single Page Application (SPA)
│   ├── src/
│   │   ├── components/           # Reusable UI components (TopNavbar, Sidebar, NotificationBell, etc.)
│   │   ├── context/              # AuthContext, ThemeContext, ToastContext
│   │   ├── pages/                # Application pages (DashboardPage, AttendancePage, SignupPage, etc.)
│   │   ├── services/             # Axios API client & modular services (apiClient.js, authService.js)
│   │   ├── App.jsx               # Main React router & layout structure
│   │   ├── main.jsx              # Application entry point
│   │   └── index.css             # Tailwind CSS & custom design system tokens
│   ├── .env.example              # Sample environment configuration for frontend
│   ├── vite.config.js            # Vite build setup
│   └── package.json              # Frontend dependencies
│
├── backend/                      # Node.js Express REST API Server
│   ├── src/
│   │   ├── config/               # Supabase backend client configuration
│   │   ├── controllers/          # Business logic controllers (auth, attendance, assignments, etc.)
│   │   ├── middleware/           # Authentication & Role-Based Access Control (RBAC) middleware
│   │   ├── routes/               # Express API endpoint routers (/api/...)
│   │   ├── services/             # Google Gemini AI Service integration
│   │   └── server.js             # Express app server entry point
│   ├── .env.example              # Sample environment configuration for backend
│   └── package.json              # Backend dependencies
│
├── database/                     # Supabase PostgreSQL Database Scripts
│   ├── schema.sql                # Complete database schema (11 tables + RLS + Seed data)
│   └── migrations/               # Database migration SQL scripts
│
├── docs/                         # Project Documentation
│   ├── projectOverview.md        # Architecture overview and role matrix
│   ├── apiDocumentation.md       # REST API endpoints documentation
│   ├── databaseDocumentation.md  # Database tables & RLS policies
│   └── testingChecklist.md       # Testing checklist and verification matrix
│
├── .gitignore                    # Git exclusion rules
├── package.json                  # Root monorepo scripts
└── README.md                     # Main project guide
```

---

## 🌟 Key Application Pages

1. **`LandingPage.jsx`**: Public landing page introducing features, live statistics, role benefits, and instant demo login shortcuts.
2. **`LoginPage.jsx` & `SignupPage.jsx`**: User authentication forms supporting Student, Faculty, and Admin registrations.
3. **`DashboardPage.jsx`**: Dynamic role-based dashboard rendering `StudentDashboardPage`, `FacultyDashboardPage`, or `AdminDashboardPage`.
4. **`AttendancePage.jsx`**: Attendance breakdown gauge for students and one-click session marking for faculty.
5. **`AssignmentsPage.jsx`**: Digital assignment creator for faculty and solution submission portal for students.
6. **`NoticesPage.jsx` & `EventsPage.jsx`**: Campus announcements filterable by categories and event registration lists.
7. **`ComplaintsPage.jsx`**: Ticket desk for filing, tracking, and resolving campus complaints (hostel, WiFi, academics).
8. **`LostAndFoundPage.jsx`**: Report lost or found campus items and send contact requests to item owners.
9. **`AIAssistantPage.jsx` & `AIStudyPlannerPage.jsx`**: Gemini AI chat assistant and custom study roadmap timetable generator.
10. **`PlacementHubPage.jsx`**: Campus placement listings, internship opportunities, and application links.
11. **`NotificationsPage.jsx`**: Centralized notification center for system alerts, notices, and ticket updates.
12. **`AnalyticsPage.jsx`**: Visual system charts displaying monthly attendance trends and complaint SLA metrics.

---

## 🔐 Authentication & Role-Based Access Control (RBAC)

Authentication is powered by **Supabase Auth** with a graceful **Backend JWT fallback**:
- **Student Role**: Accesses personal attendance records, assignment submissions, complaint filing, AI tools, and placement hub.
- **Faculty Role**: Marks attendance for assigned sections, creates assignments, posts notices/events, and resolves complaints.
- **Admin Role**: Full management access across users, departments, courses, system analytics, and security settings.

---

## 🔑 Environment Variables Setup

### Backend (`backend/.env`)
Create a `.env` file inside `backend/`:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
GEMINI_API_KEY=your-google-gemini-api-key
JWT_SECRET=campusflow-ai-super-secret-jwt-key-2026
```

### Frontend (`frontend/.env`)
Create a `.env` file inside `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> 💡 *Note*: If `SUPABASE_URL` or `GEMINI_API_KEY` are left blank, CampusFlow AI automatically operates in **Safe Fallback Mode** with built-in mock responses so you can run and present the app without any external API key setup!

---

## 💻 Running the Application Locally

### 1. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Start Servers

```bash
# Terminal 1: Run Backend Server (Port 5000)
cd backend
npm run dev

# Terminal 2: Run Frontend Web App (Port 5173)
cd frontend
npm run dev
```

Visit **`http://localhost:5173`** in your browser!

### ⚡ Instant Demo Login Accounts (Available on Login Page)
- **Student Demo**: `student@campusflow.edu` / `password123`
- **Faculty Demo**: `faculty@campusflow.edu` / `password123`
- **Admin Demo**: `admin@campusflow.edu` / `password123`

---

## 🗄️ Database Setup (Supabase PostgreSQL)

1. Open your [Supabase Dashboard](https://supabase.com).
2. Go to the **SQL Editor**.
3. Copy and run the contents of [`database/schema.sql`](file:///c:/Users/hp/Desktop/campusflow-ai/database/schema.sql).
4. Run any additional migration scripts inside [`database/migrations/`](file:///c:/Users/hp/Desktop/campusflow-ai/database/migrations).
5. All 11 tables, performance indexes, seed data, and Row Level Security (RLS) policies will be initialized safely.

---

## 📡 Key REST API Routes Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Backend Health & Service Status | No |
| `POST` | `/api/auth/login` | User Authentication | No |
| `POST` | `/api/auth/register` | User Registration | No |
| `GET` | `/api/dashboard/stats` | Dynamic Dashboard Statistics | Yes |
| `GET` | `/api/attendance` | Attendance Records Breakdown | Yes |
| `POST` | `/api/attendance/mark` | Session Attendance Marking | Faculty/Admin |
| `GET` | `/api/assignments` | List Course Assignments | Yes |
| `POST` | `/api/assignments` | Publish Assignment | Faculty/Admin |
| `GET` | `/api/notices` | List Campus Circulars | Yes |
| `POST` | `/api/complaints` | File Support Complaint Ticket | Authenticated |
| `POST` | `/api/ai/chat` | Gemini AI Campus Assistant | Authenticated |
| `POST` | `/api/ai/study-plan` | Generate Gemini AI Study Roadmap | Authenticated |

---

## 🧪 Testing Main Features

1. **Production Build Test**: Run `cd frontend && npm run build` to verify clean compilation.
2. **Backend Health Check**: Open `http://localhost:5000/api/health` in your browser.
3. **End-to-End Walkthrough**: Log in using 1-Click Demo buttons to test Student, Faculty, and Admin views.
