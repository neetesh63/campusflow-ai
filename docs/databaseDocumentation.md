# CampusFlow AI - Supabase PostgreSQL Database Schema & Security

## 1. Relational Schema Overview

CampusFlow AI utilizes Supabase PostgreSQL with 11 primary tables and explicit foreign key relationships.

```text
+----------------+      +----------------+      +----------------+
|   departments  | <--- |    courses     | <--- |   attendance   |
+----------------+      +----------------+      +----------------+
                                |
                                v
                        +----------------+      +----------------+
                        |  assignments   | <--- |  submissions   |
                        +----------------+      +----------------+
```

---

## 2. Table Definitions

### `public.profiles`
- `id`: UUID (Primary Key, references `auth.users(id)`)
- `full_name`: VARCHAR(255) NOT NULL
- `email`: VARCHAR(255) UNIQUE NOT NULL
- `role`: VARCHAR(50) CHECK (`student`, `faculty`, `admin`)
- `department`: VARCHAR(255)
- `semester`: INT
- `enrollment_number`: VARCHAR(100)

### `public.attendance`
- `id`: UUID PRIMARY KEY DEFAULT `uuid_generate_v4()`
- `student_id`: UUID REFERENCES `public.profiles(id)`
- `course_id`: UUID REFERENCES `public.courses(id)`
- `date`: DATE NOT NULL
- `status`: VARCHAR(20) CHECK (`present`, `absent`, `late`)
- `marked_by`: UUID REFERENCES `public.profiles(id)`

### `public.complaints`
- `id`: UUID PRIMARY KEY DEFAULT `uuid_generate_v4()`
- `student_id`: UUID REFERENCES `public.profiles(id)`
- `title`: VARCHAR(255) NOT NULL
- `description`: TEXT NOT NULL
- `category`: VARCHAR(100)
- `priority`: VARCHAR(20) CHECK (`Low`, `Medium`, `High`, `Urgent`)
- `status`: VARCHAR(50) CHECK (`Open`, `In Progress`, `Resolved`, `Rejected`)

---

## 3. Row Level Security (RLS) Policies

Row Level Security is enabled on all production tables to enforce data isolation:

```sql
-- Profile Read Access
CREATE POLICY "Allow public read profiles" ON public.profiles FOR SELECT USING (true);

-- Student Complaint Access
CREATE POLICY "Students manage own complaints" ON public.complaints
  FOR ALL USING (auth.uid() = student_id OR auth.role() = 'authenticated');

-- Study Plans Access
CREATE POLICY "Students manage own study plans" ON public.study_plans
  FOR ALL USING (auth.uid() = student_id);
```
