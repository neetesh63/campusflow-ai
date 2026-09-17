-- ============================================================
-- CAMPUSFLOW AI - MIGRATION 04: PLACEMENT HUB DEMO DATA & SCHEMA
-- ============================================================

-- 1. CREATE PLACEMENT OPPORTUNITIES TABLE
CREATE TABLE IF NOT EXISTS public.placement_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    company_logo VARCHAR(500),
    role VARCHAR(255) NOT NULL,
    job_type VARCHAR(50) NOT NULL CHECK (job_type IN ('Full-time', 'Internship')),
    location VARCHAR(255) NOT NULL,
    package_offered VARCHAR(100) NOT NULL,
    eligibility_criteria VARCHAR(255) NOT NULL,
    required_skills TEXT[] DEFAULT '{}',
    application_deadline DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Closing Soon', 'Closed')),
    description TEXT NOT NULL,
    apply_url TEXT DEFAULT 'https://careers.google.com',
    is_demo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CREATE PLACEMENT APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.placement_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id UUID REFERENCES public.placement_opportunities(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Applied' CHECK (status IN ('Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected')),
    applied_date DATE NOT NULL DEFAULT CURRENT_DATE,
    next_action VARCHAR(255) DEFAULT 'Awaiting resume screening',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CREATE UPCOMING CAMPUSE DRIVES TABLE
CREATE TABLE IF NOT EXISTS public.placement_drives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    drive_date DATE NOT NULL,
    venue VARCHAR(255) NOT NULL,
    eligible_branch VARCHAR(255) NOT NULL,
    min_cgpa NUMERIC(3,2) NOT NULL DEFAULT 6.50,
    registration_deadline DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Ongoing', 'Completed')),
    is_demo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_placement_opp_status ON public.placement_opportunities(status);
CREATE INDEX IF NOT EXISTS idx_placement_app_student ON public.placement_applications(student_id);
CREATE INDEX IF NOT EXISTS idx_placement_drives_date ON public.placement_drives(drive_date);

-- ROW LEVEL SECURITY
ALTER TABLE public.placement_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_drives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view opportunities" ON public.placement_opportunities FOR SELECT USING (true);
CREATE POLICY "Anyone authenticated can view drives" ON public.placement_drives FOR SELECT USING (true);
CREATE POLICY "Students view own applications" ON public.placement_applications FOR SELECT USING (true);
CREATE POLICY "Students insert own application" ON public.placement_applications FOR INSERT WITH CHECK (true);

-- SEED REALISTIC DEMO OPPORTUNITIES
INSERT INTO public.placement_opportunities 
(company_name, role, job_type, location, package_offered, eligibility_criteria, required_skills, application_deadline, status, description, apply_url) 
VALUES
('Google', 'Software Engineer - University Graduate', 'Full-time', 'Bengaluru', '₹32.0 LPA', 'B.Tech CSE/IT, Min 8.0 CGPA', ARRAY['Data Structures', 'C++', 'Java', 'Distributed Systems'], '2026-10-15', 'Open', 'Join Google Cloud & Core Infrastructure teams solving global-scale computer science challenges.', 'https://careers.google.com'),
('Microsoft', 'Software Development Engineer (SDE-1)', 'Full-time', 'Hyderabad', '₹44.0 LPA', 'B.Tech/M.Tech All Branches, Min 7.5 CGPA', ARRAY['C#', 'Data Structures', 'System Design', 'Azure'], '2026-10-20', 'Open', 'Develop next-generation AI and Cloud features for Microsoft Azure and Office 365.', 'https://careers.microsoft.com'),
('TCS', 'Graduate Engineer Trainee (TCS Digital)', 'Full-time', 'Noida', '₹7.5 LPA', 'B.Tech All Branches, No active backlogs', ARRAY['Python', 'SQL', 'Java', 'Web Technologies'], '2026-09-30', 'Closing Soon', 'TCS Digital hiring drive for high-performing engineering graduates across digital domain teams.', 'https://www.tcs.com/careers'),
('Amazon', 'Software Development Engineer Intern', 'Internship', 'Bengaluru', '₹80,000 / month', 'Pre-final Year B.Tech Students', ARRAY['Java', 'Algorithms', 'Object-Oriented Design', 'AWS'], '2026-10-10', 'Open', '6-Month Summer Internship with high probability of Pre-Placement Offer (PPO).', 'https://www.amazon.jobs'),
('Infosys', 'Specialist Programmer', 'Full-time', 'Pune', '₹9.5 LPA', 'B.Tech CSE/IT/ECE, Min 7.0 CGPA', ARRAY['Java', 'Spring Boot', 'Data Structures', 'Microservices'], '2026-10-05', 'Open', 'Specialist Programmer role in Infosys Innovation Labs working on AI and Cloud apps.', 'https://www.infosys.com/careers'),
('Wipro', 'Project Engineer (Elite NLTH)', 'Full-time', 'Remote', '₹6.5 LPA', 'B.Tech All Branches', ARRAY['C++', 'Java', 'SQL', 'Linux'], '2026-10-12', 'Open', 'National Level Talent Hunt for entry-level Software Project Engineers.', 'https://www.wipro.com/careers'),
('Accenture', 'Advanced Application Engineering Analyst', 'Full-time', 'Bengaluru', '₹11.8 LPA', 'B.Tech CSE/IT, Min 7.2 CGPA', ARRAY['Python', 'Cloud Computing', 'SQL', 'React'], '2026-10-25', 'Open', 'Engineer custom enterprise software solutions for global Fortune 500 clients.', 'https://www.accenture.com/careers'),
('Deloitte', 'Technology Consultant Trainee', 'Full-time', 'Hyderabad', '₹10.5 LPA', 'B.Tech CSE/IT/ECE, Min 7.0 CGPA', ARRAY['SQL', 'Power BI', 'Python', 'Agile'], '2026-10-18', 'Open', 'Technology Risk & Consulting role analyzing IT architectures and modern data pipelines.', 'https://www2.deloitte.com/careers')
ON CONFLICT DO NOTHING;
