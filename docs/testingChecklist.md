# CampusFlow AI - End-to-End Testing Checklist

## 1. Automated Build & Health Tests

- [x] **Frontend Production Build**: `cd frontend && npm run build` completes cleanly without errors.
- [x] **Backend Server Launch**: Node.js Express server runs on `http://localhost:5000`.
- [x] **API Health Verification**: `GET http://localhost:5000/api/health` returns status 200.

---

## 2. Feature Verification Matrix

| Module | Test Flow | Expected Behavior | Status |
| :--- | :--- | :--- | :---: |
| **Authentication** | Demo Login (Student/Faculty/Admin) | Sets user state & redirects to `/dashboard` | PASS |
| **Attendance** | View Breakdown & Mark Session | Percentage calculated & saved | PASS |
| **Assignments** | Create & Filter Assignments | Renders assignment cards with due dates | PASS |
| **Notices & Events** | Create Circular & Filter | Displays notices with category badges | PASS |
| **Complaint Desk** | Create Ticket & Change Status | Status updates to In Progress/Resolved | PASS |
| **Lost & Found** | Report Item & Send Request | Displays item card with contact option | PASS |
| **AI Study Roadmap** | Generate Plan via Gemini/Fallback | Renders structured daily schedule | PASS |
| **Notifications** | Mark Read & View All Page | Unread badge count updates dynamically | PASS |
| **Admin Controls** | Course & User Management | Tables display users & courses correctly | PASS |

---

## 3. Responsive & Accessibility Audit

- [x] **320px - 375px (Mobile)**: Navigation menu collapses into mobile drawer; cards wrap cleanly.
- [x] **768px (Tablet)**: Grid layouts adjust to 2 columns; tables scroll horizontally when required.
- [x] **1024px+ (Desktop)**: Full sidebar navigation and multi-column dashboard statistics.
