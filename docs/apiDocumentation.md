# CampusFlow AI - REST API Documentation

Base URL: `http://localhost:5000/api`

## 1. System & Health

| Endpoint | Method | Description | Auth |
| :--- | :--- | :--- | :--- |
| `/health` | GET | Check backend server status and configured services | None |
| `/supabase/test` | GET | Verify Supabase backend client connectivity | None |

---

## 2. Authentication (`/api/auth`)

| Endpoint | Method | Description | Request Body / Parameters |
| :--- | :--- | :--- | :--- |
| `/auth/login` | POST | User sign-in | `{ email, password, role }` |
| `/auth/register` | POST | Account creation | `{ email, password, full_name, role, department }` |
| `/auth/profile` | GET | Retrieve authenticated user profile | Bearer Token |

---

## 3. Dashboard & Analytics (`/api/dashboard`, `/api/analytics`)

| Endpoint | Method | Description | Auth Role |
| :--- | :--- | :--- | :--- |
| `/dashboard/stats` | GET | Fetch role-tailored dashboard metrics | Authenticated |
| `/analytics` | GET | Fetch detailed system attendance & complaint charts | Faculty, Admin |

---

## 4. Attendance Management (`/api/attendance`)

| Endpoint | Method | Description | Auth Role |
| :--- | :--- | :--- | :--- |
| `/attendance` | GET | Retrieve attendance breakdown for student or course | Authenticated |
| `/attendance/mark` | POST | Submit session attendance records | Faculty, Admin |

---

## 5. Assignments (`/api/assignments`)

| Endpoint | Method | Description | Auth Role |
| :--- | :--- | :--- | :--- |
| `/assignments` | GET | List course assignments | Authenticated |
| `/assignments` | POST | Publish a new assignment | Faculty, Admin |
| `/assignments/submit` | POST | Submit assignment solution | Student |
| `/assignments/:id/grade` | PUT | Grade a student submission | Faculty, Admin |

---

## 6. Notices & Events (`/api/notices`, `/api/events`)

| Endpoint | Method | Description | Auth Role |
| :--- | :--- | :--- | :--- |
| `/notices` | GET | List campus notices and announcements | Authenticated |
| `/notices` | POST | Publish official circular | Faculty, Admin |
| `/notices/:id` | DELETE | Remove notice | Faculty, Admin |
| `/events` | GET | List upcoming campus events | Authenticated |
| `/events` | POST | Create new event | Faculty, Admin |

---

## 7. Complaint Ticket Desk (`/api/complaints`)

| Endpoint | Method | Description | Auth Role |
| :--- | :--- | :--- | :--- |
| `/complaints` | GET | List user or system complaints | Authenticated |
| `/complaints` | POST | File a new complaint ticket | Authenticated |
| `/complaints/:id/status` | PUT | Update complaint resolution status | Faculty, Admin |

---

## 8. Lost & Found Hub (`/api/lost-found`)

| Endpoint | Method | Description | Auth Role |
| :--- | :--- | :--- | :--- |
| `/lost-found` | GET | List lost and found reported items | Authenticated |
| `/lost-found` | POST | Report a lost or found item | Authenticated |
| `/lost-found/:id/claim` | POST | Send contact request to item owner | Authenticated |
| `/lost-found/:id/status` | PUT | Update item status (e.g., claimed, returned) | Owner, Admin |

---

## 9. AI Academic Suite (`/api/ai`)

| Endpoint | Method | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `/ai/chat` | POST | Campus Assistant Gemini Chat | `{ message, conversation_history }` |
| `/ai/study-plan` | POST | Generate AI Study Roadmap | `{ subjects, hours_per_day, exam_date }` |
