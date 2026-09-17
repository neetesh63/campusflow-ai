const { supabase } = require('../config/supabase');
const { getGenerativeAIInstance } = require('../services/aiService');

let MOCK_ASSIGNMENTS = [
  {
    id: 'asg-101',
    title: 'Relational Database Schema Normalization',
    description: 'Perform 1NF, 2NF, 3NF, and BCNF normalization on the given campus registration database scenario. Submit your ER diagrams and table structures.',
    course_code: 'CSE-301',
    course_name: 'Database Management Systems',
    faculty_name: 'Prof. Alan Turing',
    due_date: '2026-09-22T23:59:00Z',
    status: 'Pending',
    priority: 'High',
    estimated_hours: 3.5,
    total_points: 100,
    attachment_url: 'https://example.com/docs/db-assignment.pdf'
  },
  {
    id: 'asg-102',
    title: 'Process Synchronization using Semaphores',
    description: 'Implement the Producer-Consumer problem in C/C++ using POSIX semaphores and mutex locks. Include deadlock prevention verification code.',
    course_code: 'CSE-302',
    course_name: 'Operating Systems',
    faculty_name: 'Prof. Sarah Jenkins',
    due_date: '2026-09-26T23:59:00Z',
    status: 'Submitted',
    priority: 'Medium',
    estimated_hours: 2.0,
    total_points: 50,
    attachment_url: null
  },
  {
    id: 'asg-103',
    title: 'Subnet Masking and CIDR Routing Table',
    description: 'Calculate VLSM subnet allocations for a enterprise campus network with 4 departments. Prepare packet flow routing table rules.',
    course_code: 'CSE-303',
    course_name: 'Computer Networks',
    faculty_name: 'Dr. Robert Vance',
    due_date: '2026-09-15T23:59:00Z',
    status: 'Graded',
    priority: 'Low',
    estimated_hours: 1.5,
    grade: '92/100',
    feedback: 'Excellent breakdown of CIDR prefix ranges!',
    total_points: 100,
    attachment_url: null
  }
];

let MOCK_PERSONAL_ASSIGNMENTS = [
  {
    id: 'pasg-1',
    student_id: 'student-id-303',
    title: 'Data Structures Tree Traversal Implementation',
    subject: 'Data Structures (CSE-301)',
    due_date: new Date(Date.now() + 86400000 * 2).toISOString(),
    priority: 'High',
    estimated_hours: 2.5,
    status: 'pending',
    created_at: new Date().toISOString()
  },
  {
    id: 'pasg-2',
    student_id: 'student-id-303',
    title: 'Database Normalization Assignment 2',
    subject: 'Database Systems (CSE-302)',
    due_date: new Date(Date.now() + 86400000 * 5).toISOString(),
    priority: 'Medium',
    estimated_hours: 3.0,
    status: 'pending',
    created_at: new Date().toISOString()
  }
];

let MOCK_SUBMISSIONS = [];

async function getAssignments(req, res) {
  try {
    const { course, status } = req.query;

    if (supabase) {
      const { data, error } = await supabase.from('assignments').select('*, courses(*)').order('due_date', { ascending: true });
      if (!error && data) {
        return res.json({ success: true, data, source: 'supabase' });
      }
    }

    let filtered = [...MOCK_ASSIGNMENTS];
    if (course) filtered = filtered.filter(a => a.course_code.toLowerCase().includes(course.toLowerCase()));
    if (status) filtered = filtered.filter(a => a.status.toLowerCase() === status.toLowerCase());

    return res.json({ success: true, data: filtered, source: 'mock' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve assignments', error: error.message });
  }
}

async function createAssignment(req, res) {
  try {
    const { title, description, course_code, due_date, total_points = 100, attachment_url } = req.body;

    if (!title || !description || !course_code || !due_date) {
      return res.status(400).json({ success: false, message: 'Title, description, course_code, and due_date are required' });
    }

    const newAssignment = {
      id: `asg-${Date.now()}`,
      title,
      description,
      course_code,
      course_name: course_code,
      faculty_name: req.user.full_name || 'Faculty Member',
      due_date,
      status: 'Pending',
      total_points,
      attachment_url: attachment_url || null,
      created_at: new Date().toISOString()
    };

    MOCK_ASSIGNMENTS.unshift(newAssignment);
    return res.status(201).json({ success: true, message: 'Assignment created successfully', data: newAssignment });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create assignment', error: error.message });
  }
}

async function submitAssignment(req, res) {
  try {
    const { assignment_id, submission_text, attachment_url } = req.body;

    if (!assignment_id) {
      return res.status(400).json({ success: false, message: 'Assignment ID is required' });
    }

    const targetAssignment = MOCK_ASSIGNMENTS.find(a => a.id === assignment_id);
    if (targetAssignment) targetAssignment.status = 'Submitted';

    const submission = {
      id: `sub-${Date.now()}`,
      assignment_id,
      student_id: req.user.id,
      student_name: req.user.full_name,
      submission_text: submission_text || '',
      attachment_url: attachment_url || '',
      submitted_at: new Date().toISOString(),
      status: 'submitted'
    };

    MOCK_SUBMISSIONS.unshift(submission);
    return res.json({ success: true, message: 'Assignment submitted successfully', data: submission });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to submit assignment', error: error.message });
  }
}

/* ============================================================
 * STUDENT PERSONAL PLANNER ASSIGNMENTS CONTROLLER
 * ============================================================ */

async function getPersonalAssignments(req, res) {
  try {
    const studentId = req.user.id;

    if (supabase) {
      const { data, error } = await supabase
        .from('student_assignments')
        .select('*')
        .eq('student_id', studentId)
        .order('due_date', { ascending: true });

      if (!error && data) {
        return res.json({ success: true, data, source: 'supabase' });
      }
    }

    const personal = MOCK_PERSONAL_ASSIGNMENTS.filter(a => a.student_id === studentId);
    return res.json({ success: true, data: personal, source: 'mock' });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to get personal assignments', error: error.message });
  }
}

async function createPersonalAssignment(req, res) {
  try {
    const studentId = req.user.id;
    const { title, subject, due_date, priority = 'Medium', estimated_hours = 1.0 } = req.body;

    if (!title || !subject || !due_date) {
      return res.status(400).json({ success: false, message: 'Title, subject, and due date are required.' });
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('student_assignments')
        .insert([
          {
            student_id: studentId,
            title,
            subject,
            due_date,
            priority,
            estimated_hours: parseFloat(estimated_hours) || 1.0,
            status: 'pending'
          }
        ])
        .select();

      if (!error && data) {
        return res.status(201).json({ success: true, message: 'Personal assignment added!', data: data[0], source: 'supabase' });
      }
    }

    const newAssignment = {
      id: `pasg-${Date.now()}`,
      student_id: studentId,
      title,
      subject,
      due_date,
      priority,
      estimated_hours: parseFloat(estimated_hours) || 1.0,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    MOCK_PERSONAL_ASSIGNMENTS.unshift(newAssignment);
    return res.status(201).json({ success: true, message: 'Personal assignment added!', data: newAssignment, source: 'mock' });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add personal assignment', error: error.message });
  }
}

async function updatePersonalAssignmentStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (supabase) {
      const { data, error } = await supabase
        .from('student_assignments')
        .update({
          status,
          completed_at: status === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', id)
        .select();

      if (!error && data) {
        return res.json({ success: true, message: `Assignment marked as ${status}`, data: data[0] });
      }
    }

    const target = MOCK_PERSONAL_ASSIGNMENTS.find(a => a.id === id);
    if (target) {
      target.status = status;
      if (status === 'completed') target.completed_at = new Date().toISOString();
      return res.json({ success: true, message: `Assignment marked as ${status}`, data: target });
    }

    return res.status(404).json({ success: false, message: 'Assignment not found' });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update assignment status', error: error.message });
  }
}

async function generateAssignmentStudySchedule(req, res) {
  try {
    const { availableHours = 4, assignments = [] } = req.body;

    if (!Array.isArray(assignments) || assignments.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide at least one pending assignment.' });
    }

    // Sort assignments by priority (High -> Medium -> Low) and due date
    const priorityWeight = { High: 3, Medium: 2, Low: 1 };
    const sorted = [...assignments].sort((a, b) => {
      const pDiff = (priorityWeight[b.priority] || 1) - (priorityWeight[a.priority] || 1);
      if (pDiff !== 0) return pDiff;
      return new Date(a.due_date) - new Date(b.due_date);
    });

    const hours = parseFloat(availableHours) || 4.0;
    let accumulated = 0;
    const scheduleBlocks = [];

    sorted.forEach((asg, idx) => {
      const reqHours = parseFloat(asg.estimated_hours) || 1.5;
      const allocated = Math.min(reqHours, Math.max(0.5, hours - accumulated));
      accumulated += allocated;

      scheduleBlocks.push({
        blockNumber: idx + 1,
        assignmentTitle: asg.title,
        subject: asg.subject || asg.course_code || 'General',
        priority: asg.priority || 'Medium',
        dueDate: asg.due_date ? new Date(asg.due_date).toLocaleDateString() : 'Upcoming',
        allocatedHours: `${allocated.toFixed(1)} hrs`,
        actionableStep: `Focus on completing high-weightage sections for "${asg.title}". Break into ${Math.ceil(allocated * 2)} Pomodoro sessions.`
      });
    });

    return res.json({
      success: true,
      data: {
        totalDailyHours: hours,
        scheduledCount: scheduleBlocks.length,
        schedule: scheduleBlocks,
        aiNote: 'Schedule generated strictly adhering to deadline urgency and estimated completion hours. (AI Generated)'
      }
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to generate study schedule', error: error.message });
  }
}

module.exports = {
  getAssignments,
  createAssignment,
  submitAssignment,
  getPersonalAssignments,
  createPersonalAssignment,
  updatePersonalAssignmentStatus,
  generateAssignmentStudySchedule
};

