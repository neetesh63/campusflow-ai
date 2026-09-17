# CampusFlow AI - Project Overview & System Architecture

## 1. Introduction

**CampusFlow AI** is a smart, full-stack campus management platform designed for universities and academic institutions. It unifies Students, Faculty Members, and Administrators into a single digital ecosystem.

### Key Objectives
- **Attendance Tracking**: Course-level marking and real-time attendance percentage analytics with low-attendance warnings.
- **Assignment Management**: Digital assignment publishing, submission tracking, and grading.
- **Notices & Events**: Official campus circulars and event registration workflows.
- **Support Ticket Desk**: Digital ticketing system for hostel, infrastructure, and academic complaints.
- **Lost & Found Hub**: Report lost or found campus items with contact request workflows.
- **AI Academic Suite**: Integrated Google Gemini AI for study plan generation and instant campus assistant queries.

---

## 2. Technology Architecture

CampusFlow AI follows a decoupled single-page application (SPA) and REST API architecture.

```text
+---------------------------------------+
|          React 19 + Vite SPA          |
|      (Tailwind CSS, Lucide React)     |
+-------------------+-------------------+
                    | REST (Axios)
                    v
+-------------------+-------------------+
|         Express.js API Server         |
|     (Auth, RBAC, Gemini AI Service)   |
+-------------------+-------------------+
                    |
          +---------+---------+
          v                   v
+------------------+ +------------------+
| Supabase Postgres| | Google Gemini AI |
|   (RLS Enabled)  | |   (Flash Model)  |
+------------------+ +------------------+
```

---

## 3. User Roles & Access Matrix

| Feature | Student | Faculty | Admin |
| :--- | :---: | :---: | :---: |
| View Own Dashboard | Yes | Yes | Yes |
| Mark Attendance | No | Yes (Permitted Courses) | Yes |
| View Attendance | Yes (Own) | Yes (Course Students) | Yes |
| Create Assignments | No | Yes | Yes |
| Submit Assignments | Yes | No | No |
| File Complaints | Yes | Yes | Yes |
| Resolve Complaints | No | Yes | Yes |
| Post Notices & Events | No | Yes | Yes |
| User Provisioning | No | No | Yes |
| System Analytics | View Limited | View Departmental | Full System |

---

## 4. Folder Structure Summary

- `frontend/`: React 19 SPA built with Vite, Tailwind CSS, and Axios.
- `backend/`: Node.js Express API server with JWT authentication and Gemini AI integration.
- `database/`: Supabase PostgreSQL schema scripts and migrations.
- `docs/`: Technical documentation and project guides.
