const { supabase } = require('../config/supabase');

// 1. DEMO PLACEMENT STATISTICS
const MOCK_PLACEMENT_STATS = {
  total_companies: 8,
  active_opportunities: 12,
  students_placed: 142,
  avg_package: '₹8.5 LPA',
  highest_package: '₹44.0 LPA',
  applications_submitted: 320,
  interviews_scheduled: 45,
  selection_rate: '78.5%'
};

// 2. DEMO PLACEMENT OPPORTUNITIES (12 Realistic Company Opportunities)
const MOCK_PLACEMENT_OPPORTUNITIES = [
  {
    id: 'opp-101',
    company_name: 'Google',
    role: 'Software Engineer - University Graduate',
    job_type: 'Full-time',
    location: 'Bengaluru',
    package_offered: '₹32.0 LPA',
    eligibility_criteria: 'B.Tech CSE/IT, Min 8.0 CGPA',
    required_skills: ['Data Structures', 'C++', 'Java', 'Distributed Systems'],
    application_deadline: '2026-10-15',
    status: 'Open',
    description: 'Join Google Cloud & Core Infrastructure teams solving global-scale computer science challenges.',
    apply_url: 'https://careers.google.com',
    is_demo: true,
    created_at: '2026-09-01T10:00:00.000Z'
  },
  {
    id: 'opp-102',
    company_name: 'Microsoft',
    role: 'Software Development Engineer (SDE-1)',
    job_type: 'Full-time',
    location: 'Hyderabad',
    package_offered: '₹44.0 LPA',
    eligibility_criteria: 'B.Tech/M.Tech All Branches, Min 7.5 CGPA',
    required_skills: ['C#', 'Data Structures', 'System Design', 'Azure'],
    application_deadline: '2026-10-20',
    status: 'Open',
    description: 'Develop next-generation AI and Cloud features for Microsoft Azure and Office 365.',
    apply_url: 'https://careers.microsoft.com',
    is_demo: true,
    created_at: '2026-09-02T11:30:00.000Z'
  },
  {
    id: 'opp-103',
    company_name: 'TCS',
    role: 'Graduate Engineer Trainee (TCS Digital)',
    job_type: 'Full-time',
    location: 'Noida',
    package_offered: '₹7.5 LPA',
    eligibility_criteria: 'B.Tech All Branches, No active backlogs',
    required_skills: ['Python', 'SQL', 'Java', 'Web Technologies'],
    application_deadline: '2026-09-30',
    status: 'Closing Soon',
    description: 'TCS Digital hiring drive for high-performing engineering graduates across digital domain teams.',
    apply_url: 'https://www.tcs.com/careers',
    is_demo: true,
    created_at: '2026-08-25T09:00:00.000Z'
  },
  {
    id: 'opp-104',
    company_name: 'Amazon',
    role: 'Software Development Engineer Intern',
    job_type: 'Internship',
    location: 'Bengaluru',
    package_offered: '₹80,000 / month',
    eligibility_criteria: 'Pre-final Year B.Tech Students',
    required_skills: ['Java', 'Algorithms', 'Object-Oriented Design', 'AWS'],
    application_deadline: '2026-10-10',
    status: 'Open',
    description: '6-Month Summer Internship with high probability of Pre-Placement Offer (PPO).',
    apply_url: 'https://www.amazon.jobs',
    is_demo: true,
    created_at: '2026-09-05T14:00:00.000Z'
  },
  {
    id: 'opp-105',
    company_name: 'Infosys',
    role: 'Specialist Programmer',
    job_type: 'Full-time',
    location: 'Pune',
    package_offered: '₹9.5 LPA',
    eligibility_criteria: 'B.Tech CSE/IT/ECE, Min 7.0 CGPA',
    required_skills: ['Java', 'Spring Boot', 'Data Structures', 'Microservices'],
    application_deadline: '2026-10-05',
    status: 'Open',
    description: 'Specialist Programmer role in Infosys Innovation Labs working on AI and Cloud apps.',
    apply_url: 'https://www.infosys.com/careers',
    is_demo: true,
    created_at: '2026-09-03T16:20:00.000Z'
  },
  {
    id: 'opp-106',
    company_name: 'Wipro',
    role: 'Project Engineer (Elite NLTH)',
    job_type: 'Full-time',
    location: 'Remote',
    package_offered: '₹6.5 LPA',
    eligibility_criteria: 'B.Tech All Branches',
    required_skills: ['C++', 'Java', 'SQL', 'Linux'],
    application_deadline: '2026-10-12',
    status: 'Open',
    description: 'National Level Talent Hunt for entry-level Software Project Engineers.',
    apply_url: 'https://www.wipro.com/careers',
    is_demo: true,
    created_at: '2026-09-04T12:00:00.000Z'
  },
  {
    id: 'opp-107',
    company_name: 'Accenture',
    role: 'Advanced Application Engineering Analyst',
    job_type: 'Full-time',
    location: 'Bengaluru',
    package_offered: '₹11.8 LPA',
    eligibility_criteria: 'B.Tech CSE/IT, Min 7.2 CGPA',
    required_skills: ['Python', 'Cloud Computing', 'SQL', 'React'],
    application_deadline: '2026-10-25',
    status: 'Open',
    description: 'Engineer custom enterprise software solutions for global Fortune 500 clients.',
    apply_url: 'https://www.accenture.com/careers',
    is_demo: true,
    created_at: '2026-09-06T09:30:00.000Z'
  },
  {
    id: 'opp-108',
    company_name: 'Deloitte',
    role: 'Technology Consultant Trainee',
    job_type: 'Full-time',
    location: 'Hyderabad',
    package_offered: '₹10.5 LPA',
    eligibility_criteria: 'B.Tech CSE/IT/ECE, Min 7.0 CGPA',
    required_skills: ['SQL', 'Power BI', 'Python', 'Agile'],
    application_deadline: '2026-10-18',
    status: 'Open',
    description: 'Technology Risk & Consulting role analyzing IT architectures and modern data pipelines.',
    apply_url: 'https://www2.deloitte.com/careers',
    is_demo: true,
    created_at: '2026-09-07T15:10:00.000Z'
  },
  {
    id: 'opp-109',
    company_name: 'TCS',
    role: 'Frontend Web Developer',
    job_type: 'Full-time',
    location: 'Bengaluru',
    package_offered: '₹9.0 LPA',
    eligibility_criteria: 'B.Tech CSE/IT, Min 6.8 CGPA',
    required_skills: ['React', 'JavaScript', 'HTML5/CSS3', 'Tailwind'],
    application_deadline: '2026-10-22',
    status: 'Open',
    description: 'Build responsive web apps and modern UI components for global banking applications.',
    apply_url: 'https://www.tcs.com/careers',
    is_demo: true,
    created_at: '2026-09-08T08:45:00.000Z'
  },
  {
    id: 'opp-110',
    company_name: 'Google',
    role: 'Cloud Solutions Engineer Intern',
    job_type: 'Internship',
    location: 'Remote',
    package_offered: '₹75,000 / month',
    eligibility_criteria: 'B.Tech 3rd/4th Year Students',
    required_skills: ['Python', 'Docker', 'Kubernetes', 'GCP'],
    application_deadline: '2026-10-28',
    status: 'Open',
    description: 'Work alongside Google Cloud Architects assisting enterprise clients with Kubernetes & DevOps migrations.',
    apply_url: 'https://careers.google.com',
    is_demo: true,
    created_at: '2026-09-09T11:00:00.000Z'
  },
  {
    id: 'opp-111',
    company_name: 'Amazon',
    role: 'Data Analyst Graduate Trainee',
    job_type: 'Full-time',
    location: 'Hyderabad',
    package_offered: '₹14.5 LPA',
    eligibility_criteria: 'B.Tech All Branches, Min 7.0 CGPA',
    required_skills: ['SQL', 'Python', 'Tableau', 'Statistics'],
    application_deadline: '2026-10-08',
    status: 'Closing Soon',
    description: 'Analyze logistics, fulfillment trends, and supply chain telemetry using SQL and Redshift.',
    apply_url: 'https://www.amazon.jobs',
    is_demo: true,
    created_at: '2026-08-30T10:00:00.000Z'
  },
  {
    id: 'opp-112',
    company_name: 'Microsoft',
    role: 'Cybersecurity Associate Analyst',
    job_type: 'Full-time',
    location: 'Noida',
    package_offered: '₹18.0 LPA',
    eligibility_criteria: 'B.Tech CSE/IT, Min 7.5 CGPA',
    required_skills: ['Ethical Hacking', 'Network Security', 'Python', 'Linux'],
    application_deadline: '2026-09-28',
    status: 'Closed',
    description: 'Monitor cloud threat vectors, conduct vulnerability assessments, and write automated incident response scripts.',
    apply_url: 'https://careers.microsoft.com',
    is_demo: true,
    created_at: '2026-08-15T09:00:00.000Z'
  }
];

// 3. DEMO STUDENT APPLICATIONS (Sample records)
const MOCK_STUDENT_APPLICATIONS = [
  {
    id: 'app-201',
    opportunity_id: 'opp-101',
    company_name: 'Google',
    role: 'Software Engineer - University Graduate',
    applied_date: '2026-09-05',
    status: 'Interview',
    next_action: 'Technical Round 2 scheduled for Sept 22',
    created_at: '2026-09-05T10:00:00.000Z'
  },
  {
    id: 'app-202',
    opportunity_id: 'opp-102',
    company_name: 'Microsoft',
    role: 'Software Development Engineer (SDE-1)',
    applied_date: '2026-09-07',
    status: 'Shortlisted',
    next_action: 'Awaiting online assessment link',
    created_at: '2026-09-07T11:00:00.000Z'
  },
  {
    id: 'app-203',
    opportunity_id: 'opp-104',
    company_name: 'Amazon',
    role: 'Software Development Engineer Intern',
    applied_date: '2026-09-10',
    status: 'Applied',
    next_action: 'Application submitted & under review',
    created_at: '2026-09-10T14:30:00.000Z'
  },
  {
    id: 'app-204',
    opportunity_id: 'opp-105',
    company_name: 'Infosys',
    role: 'Specialist Programmer',
    applied_date: '2026-09-02',
    status: 'Selected',
    next_action: 'Offer letter issued - Acceptance pending',
    created_at: '2026-09-02T09:15:00.000Z'
  },
  {
    id: 'app-205',
    opportunity_id: 'opp-103',
    company_name: 'TCS',
    role: 'Graduate Engineer Trainee (TCS Digital)',
    applied_date: '2026-08-28',
    status: 'Shortlisted',
    next_action: 'Digital Exam cleared - HR round pending',
    created_at: '2026-08-28T16:00:00.000Z'
  },
  {
    id: 'app-206',
    opportunity_id: 'opp-108',
    company_name: 'Deloitte',
    role: 'Technology Consultant Trainee',
    applied_date: '2026-09-08',
    status: 'Applied',
    next_action: 'Awaiting shortlist release',
    created_at: '2026-09-08T12:00:00.000Z'
  }
];

// 4. DEMO UPCOMING CAMPUS DRIVES
const MOCK_UPCOMING_DRIVES = [
  {
    id: 'drv-301',
    company_name: 'Google',
    drive_date: '2026-09-25',
    venue: 'Main Campus Auditorium & Online OA',
    eligible_branch: 'CSE, IT',
    min_cgpa: 8.0,
    registration_deadline: '2026-09-22',
    status: 'Upcoming',
    is_demo: true
  },
  {
    id: 'drv-302',
    company_name: 'Microsoft',
    drive_date: '2026-09-28',
    venue: 'Virtual Teams Drive',
    eligible_branch: 'All Branches',
    min_cgpa: 7.5,
    registration_deadline: '2026-09-24',
    status: 'Upcoming',
    is_demo: true
  },
  {
    id: 'drv-303',
    company_name: 'TCS',
    drive_date: '2026-10-02',
    venue: 'Block B Computer Lab 3 & 4',
    eligible_branch: 'All Branches',
    min_cgpa: 6.0,
    registration_deadline: '2026-09-29',
    status: 'Upcoming',
    is_demo: true
  },
  {
    id: 'drv-304',
    company_name: 'Amazon',
    drive_date: '2026-10-08',
    venue: 'Online HackerRank Platform',
    eligible_branch: 'CSE, IT, ECE',
    min_cgpa: 7.0,
    registration_deadline: '2026-10-04',
    status: 'Upcoming',
    is_demo: true
  },
  {
    id: 'drv-305',
    company_name: 'Accenture',
    drive_date: '2026-10-15',
    venue: 'Seminar Hall 1',
    eligible_branch: 'CSE, IT',
    min_cgpa: 6.5,
    registration_deadline: '2026-10-10',
    status: 'Upcoming',
    is_demo: true
  }
];

// 5. DEMO PREPARATION PROGRESS
let MOCK_PLACEMENT_PROGRESS = {
  dsa_solved: 48,
  dsa_total: 100,
  aptitude_solved: 35,
  aptitude_total: 50,
  core_subjects: [
    { id: 'cs1', name: 'Data Structures & Algorithms', status: 'Completed' },
    { id: 'cs2', name: 'Database Management Systems', status: 'Completed' },
    { id: 'cs3', name: 'Operating Systems', status: 'In Progress' },
    { id: 'cs4', name: 'Computer Networks', status: 'In Progress' },
    { id: 'cs5', name: 'Object-Oriented Programming (C++/Java)', status: 'Completed' }
  ],
  resume_checklist: [
    { id: 'r1', text: 'ATS-Friendly Formatting Verified', done: true },
    { id: 'r2', text: 'Project GitHub Repositories Linked', done: true },
    { id: 'r3', text: 'Quantifiable Metrics in Experience Bullets', done: true },
    { id: 'r4', text: 'LinkedIn & LeetCode Profiles Updated', done: false }
  ],
  mock_interviews_done: 4,
  daily_goal_minutes: 60,
  mock_interview_questions: [
    { id: 'q1', category: 'DSA', question: 'Explain how you would detect a cycle in a directed vs undirected graph?', difficulty: 'Medium' },
    { id: 'q2', category: 'DBMS', question: 'What is the difference between WHERE and HAVING clause in SQL?', difficulty: 'Easy' },
    { id: 'q3', category: 'OS', question: 'Explain virtual memory and page fault resolution mechanism in operating systems.', difficulty: 'Medium' },
    { id: 'q4', category: 'Networks', question: 'Trace what happens step-by-step when you type https://google.com in a browser address bar.', difficulty: 'Hard' }
  ]
};

// GET /api/placement/opportunities
async function getPlacementOpportunities(req, res) {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('placement_opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return res.json({ success: true, data, source: 'supabase' });
      }
    }

    return res.json({ success: true, data: MOCK_PLACEMENT_OPPORTUNITIES, source: 'mock' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch opportunities', error: error.message });
  }
}

// GET /api/placement/stats
async function getPlacementStats(req, res) {
  try {
    return res.json({ success: true, data: MOCK_PLACEMENT_STATS, source: 'mock' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch stats', error: error.message });
  }
}

// GET /api/placement/applications
async function getStudentApplications(req, res) {
  try {
    if (supabase && req.user?.id) {
      const { data, error } = await supabase
        .from('placement_applications')
        .select('*')
        .eq('student_id', req.user.id)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return res.json({ success: true, data, source: 'supabase' });
      }
    }

    return res.json({ success: true, data: MOCK_STUDENT_APPLICATIONS, source: 'mock' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch applications', error: error.message });
  }
}

// GET /api/placement/drives
async function getUpcomingDrives(req, res) {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('placement_drives')
        .select('*')
        .order('drive_date', { ascending: true });

      if (!error && data && data.length > 0) {
        return res.json({ success: true, data, source: 'supabase' });
      }
    }

    return res.json({ success: true, data: MOCK_UPCOMING_DRIVES, source: 'mock' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch drives', error: error.message });
  }
}

// POST /api/placement/apply
async function applyForOpportunity(req, res) {
  try {
    const { opportunity_id, company_name, role } = req.body;
    const studentId = req.user?.id || 'demo-student-id';
    const studentName = req.user?.full_name || 'Alex Johnson';

    const newApp = {
      id: `app-${Date.now()}`,
      opportunity_id: opportunity_id || 'opp-101',
      student_id: studentId,
      student_name: studentName,
      company_name: company_name || 'Campus Partner',
      role: role || 'Software Trainee',
      status: 'Applied',
      applied_date: new Date().toISOString().split('T')[0],
      next_action: 'Application submitted successfully',
      created_at: new Date().toISOString()
    };

    if (supabase && req.user?.id) {
      try {
        const { data, error } = await supabase
          .from('placement_applications')
          .insert([newApp])
          .select();
        if (!error && data) {
          return res.json({ success: true, message: 'Application submitted successfully!', data: data[0], source: 'supabase' });
        }
      } catch (e) {}
    }

    MOCK_STUDENT_APPLICATIONS.unshift(newApp);
    return res.json({ success: true, message: 'Application submitted successfully!', data: newApp, source: 'mock' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to apply', error: error.message });
  }
}

// POST /api/placement/seed
async function seedPlacementData(req, res) {
  try {
    let seededOppCount = MOCK_PLACEMENT_OPPORTUNITIES.length;
    let seededDrivesCount = MOCK_UPCOMING_DRIVES.length;

    if (supabase) {
      try {
        await supabase.from('placement_opportunities').upsert(MOCK_PLACEMENT_OPPORTUNITIES, { onConflict: 'id' });
        await supabase.from('placement_drives').upsert(MOCK_UPCOMING_DRIVES, { onConflict: 'id' });
      } catch (e) {
        console.warn('Supabase seed notice:', e.message);
      }
    }

    return res.json({
      success: true,
      message: 'Placement demo data seeded successfully!',
      stats: {
        companies: MOCK_PLACEMENT_STATS.total_companies,
        opportunities: seededOppCount,
        applications: MOCK_STUDENT_APPLICATIONS.length,
        drives: seededDrivesCount
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Seed error', error: error.message });
  }
}

// GET /api/placement/progress
async function getPlacementProgress(req, res) {
  try {
    const studentId = req.user?.id;

    if (supabase && studentId) {
      const { data, error } = await supabase
        .from('placement_progress')
        .select('*')
        .eq('student_id', studentId)
        .maybeSingle();

      if (!error && data) {
        return res.json({
          success: true,
          data: {
            ...MOCK_PLACEMENT_PROGRESS,
            ...data
          },
          source: 'supabase'
        });
      }
    }

    return res.json({
      success: true,
      data: MOCK_PLACEMENT_PROGRESS,
      source: 'mock'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch placement progress', error: error.message });
  }
}

// PUT /api/placement/progress
async function updatePlacementProgress(req, res) {
  try {
    const studentId = req.user?.id;
    const { dsa_solved, aptitude_solved, core_subjects, resume_checklist, mock_interviews_done, daily_goal_minutes } = req.body;

    if (supabase && studentId) {
      const payload = {
        student_id: studentId,
        dsa_solved: dsa_solved !== undefined ? dsa_solved : MOCK_PLACEMENT_PROGRESS.dsa_solved,
        aptitude_solved: aptitude_solved !== undefined ? aptitude_solved : MOCK_PLACEMENT_PROGRESS.aptitude_solved,
        core_subjects: core_subjects || MOCK_PLACEMENT_PROGRESS.core_subjects,
        resume_checklist: resume_checklist || MOCK_PLACEMENT_PROGRESS.resume_checklist,
        mock_interviews_done: mock_interviews_done !== undefined ? mock_interviews_done : MOCK_PLACEMENT_PROGRESS.mock_interviews_done,
        daily_goal_minutes: daily_goal_minutes || MOCK_PLACEMENT_PROGRESS.daily_goal_minutes,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('placement_progress')
        .upsert(payload, { onConflict: 'student_id' })
        .select();

      if (!error && data) {
        return res.json({ success: true, message: 'Placement preparation progress saved!', data: data[0], source: 'supabase' });
      }
    }

    if (dsa_solved !== undefined) MOCK_PLACEMENT_PROGRESS.dsa_solved = dsa_solved;
    if (aptitude_solved !== undefined) MOCK_PLACEMENT_PROGRESS.aptitude_solved = aptitude_solved;
    if (core_subjects) MOCK_PLACEMENT_PROGRESS.core_subjects = core_subjects;
    if (resume_checklist) MOCK_PLACEMENT_PROGRESS.resume_checklist = resume_checklist;
    if (mock_interviews_done !== undefined) MOCK_PLACEMENT_PROGRESS.mock_interviews_done = mock_interviews_done;
    if (daily_goal_minutes) MOCK_PLACEMENT_PROGRESS.daily_goal_minutes = daily_goal_minutes;

    return res.json({ success: true, message: 'Placement preparation progress saved!', data: MOCK_PLACEMENT_PROGRESS, source: 'mock' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update placement progress', error: error.message });
  }
}

module.exports = {
  getPlacementOpportunities,
  getPlacementStats,
  getStudentApplications,
  getUpcomingDrives,
  applyForOpportunity,
  seedPlacementData,
  getPlacementProgress,
  updatePlacementProgress
};
