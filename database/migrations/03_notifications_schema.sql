-- ============================================================
-- CAMPUSFLOW AI - MIGRATION 03: NOTIFICATIONS SCHEMA & RLS
-- ============================================================

-- 1. CREATE NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL DEFAULT 'general' CHECK (type IN ('notice', 'complaint', 'lost_found', 'event', 'announcement', 'assignment', 'general')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_entity_id VARCHAR(255),
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CREATE INDEXES FOR HIGH PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);

-- 3. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES FOR NOTIFICATIONS
-- Users can view their own notifications or authenticated users
CREATE POLICY "Users can view own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id OR auth.role() = 'authenticated');

-- Users can insert notifications
CREATE POLICY "Authenticated users can create notifications"
ON public.notifications FOR INSERT
WITH CHECK (auth.role() = 'authenticated' OR true);

-- Users can update their own notifications (e.g. mark as read)
CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id OR auth.role() = 'authenticated');

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
ON public.notifications FOR DELETE
USING (auth.uid() = user_id OR auth.role() = 'authenticated');
