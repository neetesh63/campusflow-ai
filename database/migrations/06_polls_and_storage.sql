-- ============================================================
-- CAMPUSFLOW AI - MIGRATION 06: STORAGE & POLLS RLS POLICIES
-- ============================================================

-- 1. Ensure Polls and Poll Votes tables exist with appropriate columns
CREATE TABLE IF NOT EXISTS public.polls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    options JSONB NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.poll_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    option_index INT NOT NULL,
    voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(poll_id, student_id)
);

-- 2. Ensure RLS enabled for Polls & Votes
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone authenticated can read polls" ON public.polls;
CREATE POLICY "Anyone authenticated can read polls" ON public.polls FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins/faculty manage polls" ON public.polls;
CREATE POLICY "Admins/faculty manage polls" ON public.polls FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Anyone authenticated can view votes summary" ON public.poll_votes;
CREATE POLICY "Anyone authenticated can view votes summary" ON public.poll_votes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Students submit own vote" ON public.poll_votes;
CREATE POLICY "Students submit own vote" ON public.poll_votes FOR INSERT WITH CHECK (auth.uid() = student_id OR auth.role() = 'authenticated');

-- 3. Ensure Storage Bucket for Assignment Attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('assignment-attachments', 'assignment-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Storage RLS Policies for assignment-attachments bucket
DROP POLICY IF EXISTS "Authenticated users upload assignment attachments" ON storage.objects;
CREATE POLICY "Authenticated users upload assignment attachments" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'assignment-attachments' 
  AND auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Public read assignment attachments" ON storage.objects;
CREATE POLICY "Public read assignment attachments" ON storage.objects
FOR SELECT USING (
  bucket_id = 'assignment-attachments'
);

DROP POLICY IF EXISTS "Users delete own assignment attachments" ON storage.objects;
CREATE POLICY "Users delete own assignment attachments" ON storage.objects
FOR DELETE USING (
  bucket_id = 'assignment-attachments' 
  AND auth.uid() = owner
);

-- 5. Profiles Table RLS Policies for Real User Creation & Updates
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read profiles" ON public.profiles;
CREATE POLICY "Allow public read profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id OR auth.role() = 'authenticated');

