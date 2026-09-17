const { supabase } = require('../config/supabase');

let MOCK_NOTICES = [
  {
    id: 'not-101',
    title: 'Schedule for Mid-Semester Examinations Autumn 2026',
    content: 'The mid-semester examinations for all 3rd and 5th semester B.Tech programs will commence from October 5th, 2026. Hall tickets will be issued digitally through the student portal next week.',
    category: 'Exam',
    author: 'Controller of Examinations',
    published_at: '2026-09-12T09:00:00Z',
    expires_at: '2026-10-15T23:59:00Z',
    priority: 'High'
  },
  {
    id: 'not-102',
    title: 'Annual Campus Placement Drive - Registration Open',
    content: 'Leading software enterprises including IBM, Google, and Microsoft will be visiting campus for 2026-27 placements. Eligible 7th semester students must register before September 25th.',
    category: 'Placement',
    author: 'Training & Placement Officer',
    published_at: '2026-09-10T14:30:00Z',
    expires_at: '2026-09-25T23:59:00Z',
    priority: 'Urgent'
  },
  {
    id: 'not-103',
    title: 'Library Maintenance & Extended Digital Hours',
    content: 'Central Library main reading room will undergo minor HVAC maintenance this Sunday. Access to IEEE Xplore and ACM Digital Library remains available 24/7.',
    category: 'General',
    author: 'Chief Librarian',
    published_at: '2026-09-08T11:20:00Z',
    expires_at: '2026-09-30T23:59:00Z',
    priority: 'Medium'
  }
];

async function getNotices(req, res) {
  try {
    const { category, search } = req.query;

    if (supabase) {
      let query = supabase.from('notices').select('*').order('published_at', { ascending: false });
      if (category && category !== 'All') {
        query = query.eq('category', category);
      }
      if (search) {
        query = query.ilike('title', `%${search}%`);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return res.json({
          success: true,
          message: 'Notices retrieved from Supabase',
          data,
          source: 'supabase'
        });
      }
    }

    // Fallback to mock data if database table is empty or unpopulated
    let list = [...MOCK_NOTICES];
    if (category && category !== 'All') {
      list = list.filter(n => n.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
    }

    return res.json({
      success: true,
      message: 'Notices retrieved',
      data: list,
      source: 'mock'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch notices', error: error.message });
  }
}

async function createNotice(req, res) {
  try {
    const { title, content, category = 'General', expires_at, priority = 'Medium' } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('notices')
        .insert([
          {
            title,
            content,
            category,
            expires_at: expires_at || null
          }
        ])
        .select();

      if (!error && data && data.length > 0) {
        return res.status(201).json({
          success: true,
          message: 'Notice published to Supabase',
          data: data[0],
          source: 'supabase'
        });
      }
    }

    // Fallback insertion
    const newNotice = {
      id: `not-${Date.now()}`,
      title,
      content,
      category,
      author: (req.user && req.user.full_name) ? req.user.full_name : 'Admin',
      published_at: new Date().toISOString(),
      expires_at: expires_at || null,
      priority
    };

    MOCK_NOTICES.unshift(newNotice);

    return res.status(201).json({
      success: true,
      message: 'Notice published successfully',
      data: newNotice,
      source: 'mock'
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create notice', error: error.message });
  }
}

async function deleteNotice(req, res) {
  try {
    const { id } = req.params;
    if (supabase) {
      await supabase.from('notices').delete().eq('id', id);
    }
    MOCK_NOTICES = MOCK_NOTICES.filter(n => n.id !== id);
    return res.json({ success: true, message: 'Notice deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete notice', error: error.message });
  }
}

module.exports = {
  getNotices,
  createNotice,
  deleteNotice
};

