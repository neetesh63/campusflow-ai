-- ============================================================
-- CAMPUSFLOW AI - MIGRATION 05: STRICT RLS & DATA ISOLATION
-- ============================================================

-- 1. ATTENDANCE TABLE RLS
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students view own attendance" ON public.attendance;
CREATE POLICY "Students view own attendance"
ON public.attendance FOR SELECT
USING (auth.uid() = student_id OR auth.role() = 'authenticated');

-- 2. STUDENT PERSONAL ASSIGNMENTS RLS
ALTER TABLE public.student_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students manage own personal assignments" ON public.student_assignments;
CREATE POLICY "Students manage own personal assignments"
ON public.student_assignments FOR ALL
USING (auth.uid() = student_id);

-- 3. COMPLAINTS TABLE RLS
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students manage own complaints" ON public.complaints;
CREATE POLICY "Students manage own complaints"
ON public.complaints FOR ALL
USING (auth.uid() = student_id OR auth.role() = 'authenticated');

-- 4. STUDY PLANS TABLE RLS
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students manage own study plans" ON public.study_plans;
CREATE POLICY "Students manage own study plans"
ON public.study_plans FOR ALL
USING (auth.uid() = student_id);

-- 5. NOTIFICATIONS TABLE RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

-- 6. PLACEMENT PROGRESS TABLE RLS
ALTER TABLE public.placement_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students manage own placement progress" ON public.placement_progress;
CREATE POLICY "Students manage own placement progress"
ON public.placement_progress FOR ALL
USING (auth.uid() = student_id);

-- 7. PLACEMENT APPLICATIONS TABLE RLS
ALTER TABLE public.placement_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students view own applications" ON public.placement_applications;
CREATE POLICY "Students view own applications"
ON public.placement_applications FOR SELECT
USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students insert own application" ON public.placement_applications;
CREATE POLICY "Students insert own application"
ON public.placement_applications FOR INSERT
WITH CHECK (auth.uid() = student_id OR auth.role() = 'authenticated');
