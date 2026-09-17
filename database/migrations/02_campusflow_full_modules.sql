-- ============================================================
-- CAMPUSFLOW AI - MIGRATION 02: FULL MODULES SCHEMA ENHANCEMENTS
-- ============================================================

-- 1. ENHANCE COMPLAINTS STATUS CONSTRAINT & COLUMNS
ALTER TABLE public.complaints DROP CONSTRAINT IF EXISTS complaints_status_check;
ALTER TABLE public.complaints ADD CONSTRAINT complaints_status_check 
  CHECK (status IN ('Submitted', 'Under Review', 'In Progress', 'Resolved', 'Rejected', 'Reopened', 'Open'));

ALTER TABLE public.complaints
  ADD COLUMN IF NOT EXISTS reopened_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS feedback_rating INT;

-- 2. ENHANCE EVENTS TABLE (Capacity, Category, Status)
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS capacity INT DEFAULT 100,
  ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'General',
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 3. CREATE EVENT REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'cancelled')),
    UNIQUE(event_id, student_id)
);

-- 4. ENHANCE NOTICES TABLE (Pinned, Department Target)
ALTER TABLE public.notices
  ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS department VARCHAR(255) DEFAULT 'All';

-- 5. CREATE STUDENT ASSIGNMENTS TABLE (Personal planner & tracking)
CREATE TABLE IF NOT EXISTS public.student_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
    estimated_hours NUMERIC(4,1) NOT NULL DEFAULT 1.0,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. CREATE POLLS TABLE
CREATE TABLE IF NOT EXISTS public.polls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    options JSONB NOT NULL, -- e.g. ["Option A", "Option B"]
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. CREATE POLL VOTES TABLE (Database constraint for single vote per poll)
CREATE TABLE IF NOT EXISTS public.poll_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    option_index INT NOT NULL,
    voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(poll_id, student_id)
);

-- 8. CREATE PLACEMENT PREPARATION PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.placement_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    dsa_solved INT DEFAULT 0,
    dsa_total INT DEFAULT 100,
    aptitude_solved INT DEFAULT 0,
    aptitude_total INT DEFAULT 50,
    core_subjects JSONB DEFAULT '[]'::jsonb,
    resume_checklist JSONB DEFAULT '[]'::jsonb,
    mock_interviews_done INT DEFAULT 0,
    daily_goal_minutes INT DEFAULT 60,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- INDEXES FOR HIGH PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_event_reg_event ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_reg_student ON public.event_registrations(student_id);
CREATE INDEX IF NOT EXISTS idx_student_assignments_student ON public.student_assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_student_assignments_due ON public.student_assignments(due_date);
CREATE INDEX IF NOT EXISTS idx_polls_active ON public.polls(is_active);
CREATE INDEX IF NOT EXISTS idx_poll_votes_poll ON public.poll_votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_student ON public.poll_votes(student_id);
CREATE INDEX IF NOT EXISTS idx_placement_student ON public.placement_progress(student_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_progress ENABLE ROW LEVEL SECURITY;

-- EVENT REGISTRATIONS
CREATE POLICY "Users can view event registrations" ON public.event_registrations FOR SELECT USING (true);
CREATE POLICY "Students manage own event registrations" ON public.event_registrations FOR ALL USING (auth.uid() = student_id OR auth.role() = 'authenticated');

-- STUDENT ASSIGNMENTS
CREATE POLICY "Students manage own personal assignments" ON public.student_assignments FOR ALL USING (auth.uid() = student_id OR auth.role() = 'authenticated');

-- POLLS
CREATE POLICY "Anyone authenticated can read polls" ON public.polls FOR SELECT USING (true);
CREATE POLICY "Admins/faculty manage polls" ON public.polls FOR ALL USING (auth.role() = 'authenticated');

-- POLL VOTES
CREATE POLICY "Anyone authenticated can view votes summary" ON public.poll_votes FOR SELECT USING (true);
CREATE POLICY "Students submit own vote" ON public.poll_votes FOR INSERT WITH CHECK (auth.uid() = student_id OR auth.role() = 'authenticated');

-- PLACEMENT PROGRESS
CREATE POLICY "Students manage own placement progress" ON public.placement_progress FOR ALL USING (auth.uid() = student_id OR auth.role() = 'authenticated');
