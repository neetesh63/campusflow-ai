-- ============================================================
-- CAMPUSFLOW AI - MIGRATION 01: COMPLAINTS ENHANCEMENT & LOST & FOUND
-- ============================================================

-- 1. ENHANCE COMPLAINTS TABLE
ALTER TABLE public.complaints
ADD COLUMN IF NOT EXISTS attachment_url TEXT,
ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP WITH TIME ZONE;

-- 2. CREATE LOST_FOUND_ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.lost_found_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('lost', 'found')),
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Other',
    location VARCHAR(255) NOT NULL,
    incident_date DATE NOT NULL,
    image_url TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'claimed', 'returned', 'closed')),
    contact_preference VARCHAR(100) NOT NULL DEFAULT 'In-App Request',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CREATE LOST_FOUND_CONTACT_REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.lost_found_contact_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES public.lost_found_items(id) ON DELETE CASCADE,
    requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    requester_name VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_lost_found_user ON public.lost_found_items(user_id);
CREATE INDEX IF NOT EXISTS idx_lost_found_type ON public.lost_found_items(report_type);
CREATE INDEX IF NOT EXISTS idx_lost_found_category ON public.lost_found_items(category);
CREATE INDEX IF NOT EXISTS idx_lost_found_status ON public.lost_found_items(status);
CREATE INDEX IF NOT EXISTS idx_contact_requests_item ON public.lost_found_contact_requests(item_id);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.lost_found_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lost_found_contact_requests ENABLE ROW LEVEL SECURITY;

-- POLICIES FOR LOST_FOUND_ITEMS
CREATE POLICY "Allow public/authenticated read lost_found_items"
ON public.lost_found_items FOR SELECT USING (true);

CREATE POLICY "Users can create lost_found_items"
ON public.lost_found_items FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR true);

CREATE POLICY "Users can update own lost_found_items"
ON public.lost_found_items FOR UPDATE USING (auth.uid() = user_id OR auth.role() = 'authenticated');

-- POLICIES FOR CONTACT REQUESTS
CREATE POLICY "Users can insert contact requests"
ON public.lost_found_contact_requests FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR true);

CREATE POLICY "Users can view contact requests for their items or own requests"
ON public.lost_found_contact_requests FOR SELECT USING (true);
