const { supabase } = require('../config/supabase');

let MOCK_COMPLAINTS = [
  {
    id: 'cmp-501',
    student_id: 'student-id-303',
    student_name: 'Alex Johnson',
    student_email: 'student@campusflow.edu',
    title: 'WiFi Connection Intermittent in Hostel Block C, 3rd Floor',
    description: 'The wireless access point disconnects frequently during evening study hours (08:00 PM - 11:00 PM). Requesting network team inspection.',
    category: 'Infrastructure',
    priority: 'High',
    status: 'In Progress',
    assigned_to: 'IT Infrastructure Admin',
    resolution_note: 'Router firmware update initiated and additional access point installed.',
    attachment_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=300',
    created_at: '2026-09-11T10:15:00Z',
    updated_at: '2026-09-12T16:00:00Z'
  },
  {
    id: 'cmp-502',
    student_id: 'student-id-303',
    student_name: 'Alex Johnson',
    student_email: 'student@campusflow.edu',
    title: 'Missing Lab Marks in 5th Semester Portal Summary',
    description: 'Computer Networks Lab internal marks are showing as pending in the semester statement despite submitting all 10 experiments.',
    category: 'Academic',
    priority: 'Medium',
    status: 'Resolved',
    assigned_to: 'Prof. Alan Turing',
    resolution_note: 'Marks verified from lab attendance register and updated in grade database.',
    attachment_url: null,
    created_at: '2026-09-05T14:20:00Z',
    updated_at: '2026-09-08T11:45:00Z',
    resolved_at: '2026-09-08T11:45:00Z'
  },
  {
    id: 'cmp-503',
    student_id: 'user-892',
    student_name: 'Emily Davis',
    student_email: 'emily@campusflow.edu',
    title: 'Mess Menu Hygiene and Water Purifier Service',
    description: 'Main cafeteria block 2 water filter indicator is red. Requesting urgent filter replacement.',
    category: 'Hostel',
    priority: 'Urgent',
    status: 'Open',
    assigned_to: null,
    resolution_note: null,
    attachment_url: null,
    created_at: '2026-09-13T08:30:00Z',
    updated_at: '2026-09-13T08:30:00Z'
  },
  {
    id: 'cmp-504',
    student_id: 'student-id-303',
    student_name: 'Alex Johnson',
    student_email: 'student@campusflow.edu',
    title: 'Library Study Room Air Conditioning Noise Issue',
    description: 'AC unit in quiet study room 3 makes loud rattling sound, disturbing students preparing for exams.',
    category: 'Cleanliness',
    priority: 'Low',
    status: 'Open',
    assigned_to: null,
    resolution_note: null,
    attachment_url: null,
    created_at: '2026-09-13T14:10:00Z',
    updated_at: '2026-09-13T14:10:00Z'
  }
];

async function getComplaints(req, res) {
  try {
    const { status, priority, category, search } = req.query;

    if (supabase) {
      let query = supabase.from('complaints').select('*').order('created_at', { ascending: false });

      // If student, filter to show only their own complaints
      if (req.user.role === 'student') {
        query = query.eq('student_id', req.user.id);
      }

      if (status && status !== 'All') {
        query = query.ilike('status', status);
      }
      if (priority && priority !== 'All') {
        query = query.ilike('priority', priority);
      }
      if (category && category !== 'All') {
        query = query.ilike('category', `%${category}%`);
      }
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (!error && data) {
        return res.json({
          success: true,
          message: 'Complaints list retrieved from Supabase',
          data,
          source: 'supabase'
        });
      }
    }

    // Fallback Mock List
    let list = [...MOCK_COMPLAINTS];

    if (req.user.role === 'student') {
      list = list.filter(c => c.student_id === req.user.id || c.student_email === req.user.email);
    }

    if (status && status !== 'All') {
      list = list.filter(c => c.status.toLowerCase() === status.toLowerCase());
    }
    if (priority && priority !== 'All') {
      list = list.filter(c => c.priority.toLowerCase() === priority.toLowerCase());
    }
    if (category && category !== 'All') {
      list = list.filter(c => c.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
    }

    return res.json({
      success: true,
      message: 'Complaints list retrieved',
      data: list,
      source: 'mock'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve complaints', error: error.message });
  }
}

async function createComplaint(req, res) {
  try {
    const { title, description, category = 'General', priority = 'Medium', attachment_url } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('complaints')
        .insert([
          {
            student_id: req.user.id,
            title,
            description,
            category,
            priority,
            status: 'Open',
            attachment_url: attachment_url || null
          }
        ])
        .select();

      if (!error && data && data.length > 0) {
        return res.status(201).json({
          success: true,
          message: 'Complaint submitted successfully to Supabase',
          data: data[0],
          source: 'supabase'
        });
      }
    }

    // Mock Insertion
    const newComplaint = {
      id: `cmp-${Date.now()}`,
      student_id: req.user.id,
      student_name: req.user.full_name || 'Student User',
      student_email: req.user.email,
      title,
      description,
      category,
      priority,
      status: 'Open',
      assigned_to: null,
      resolution_note: null,
      attachment_url: attachment_url || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    MOCK_COMPLAINTS.unshift(newComplaint);

    return res.status(201).json({
      success: true,
      message: 'Complaint ticket submitted successfully',
      data: newComplaint,
      source: 'mock'
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to submit complaint', error: error.message });
  }
}

async function updateComplaintStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, assigned_to, resolution_note } = req.body;

    if (supabase) {
      const updateData = { updated_at: new Date().toISOString() };
      if (status) updateData.status = status;
      if (assigned_to) updateData.assigned_to = assigned_to;
      if (resolution_note !== undefined) updateData.resolution_note = resolution_note;
      if (status === 'Resolved') updateData.resolved_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('complaints')
        .update(updateData)
        .eq('id', id)
        .select();

      if (!error && data && data.length > 0) {
        return res.json({
          success: true,
          message: `Complaint status updated to ${status}`,
          data: data[0],
          source: 'supabase'
        });
      }
    }

    // Mock Update
    const target = MOCK_COMPLAINTS.find(c => c.id === id);
    if (!target) {
      return res.status(404).json({ success: false, message: 'Complaint ticket not found' });
    }

    if (status) target.status = status;
    if (assigned_to) target.assigned_to = assigned_to;
    if (resolution_note !== undefined) target.resolution_note = resolution_note;
    if (status === 'Resolved') target.resolved_at = new Date().toISOString();
    target.updated_at = new Date().toISOString();

    return res.json({
      success: true,
      message: `Complaint ticket updated to ${target.status}`,
      data: target,
      source: 'mock'
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update complaint status', error: error.message });
  }
}

async function reopenComplaint(req, res) {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (supabase) {
      const updateData = {
        status: 'Reopened',
        reopened_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      if (reason) updateData.resolution_note = `[Reopened Note]: ${reason}`;

      const { data, error } = await supabase
        .from('complaints')
        .update(updateData)
        .eq('id', id)
        .select();

      if (!error && data && data.length > 0) {
        return res.json({
          success: true,
          message: 'Complaint has been reopened',
          data: data[0],
          source: 'supabase'
        });
      }
    }

    const target = MOCK_COMPLAINTS.find(c => c.id === id);
    if (!target) {
      return res.status(404).json({ success: false, message: 'Complaint ticket not found' });
    }

    target.status = 'Reopened';
    target.reopened_at = new Date().toISOString();
    if (reason) target.resolution_note = `[Reopened Note]: ${reason}`;
    target.updated_at = new Date().toISOString();

    return res.json({
      success: true,
      message: 'Complaint ticket has been reopened',
      data: target,
      source: 'mock'
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to reopen complaint', error: error.message });
  }
}

module.exports = {
  getComplaints,
  createComplaint,
  updateComplaintStatus,
  reopenComplaint
};

