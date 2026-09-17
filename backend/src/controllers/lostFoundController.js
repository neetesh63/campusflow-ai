const { supabase } = require('../config/supabase');
const { generateCampusAIChat } = require('../services/aiService');

let MOCK_ITEMS = [
  {
    id: 'lf-901',
    user_id: 'student-id-303',
    reporter_name: 'Alex Johnson',
    item_name: 'Apple AirPods Pro (2nd Gen) in Blue Silicon Case',
    report_type: 'lost',
    description: 'Lost my wireless earbuds near the Central Library reading room 2. The case has a small navy blue carabiner attached.',
    category: 'Electronics',
    location: 'Central Library 2nd Floor',
    incident_date: '2026-09-12',
    image_url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400',
    status: 'open',
    contact_preference: 'In-App Request',
    created_at: '2026-09-12T11:20:00Z',
    updated_at: '2026-09-12T11:20:00Z'
  },
  {
    id: 'lf-902',
    user_id: 'user-892',
    reporter_name: 'Emily Davis',
    item_name: 'Found Blue Charging Case with Earbuds',
    report_type: 'found',
    description: 'Found bluetooth earbuds in a blue silicon cover on a table near library computer lab 3.',
    category: 'Electronics',
    location: 'Central Library 2nd Floor',
    incident_date: '2026-09-12',
    image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
    status: 'open',
    contact_preference: 'In-App Request',
    created_at: '2026-09-12T14:45:00Z',
    updated_at: '2026-09-12T14:45:00Z'
  },
  {
    id: 'lf-903',
    user_id: 'faculty-id-202',
    reporter_name: 'Prof. Alan Turing',
    item_name: 'Brown Leather Notebook & Parker Pen Set',
    report_type: 'lost',
    description: 'Left a brown leather notebook containing CSE-301 lecture notes in Main Auditorium Row E.',
    category: 'Books',
    location: 'Main Auditorium',
    incident_date: '2026-09-10',
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
    status: 'returned',
    contact_preference: 'In-App Request',
    created_at: '2026-09-10T16:00:00Z',
    updated_at: '2026-09-11T09:30:00Z'
  },
  {
    id: 'lf-904',
    user_id: 'student-id-303',
    reporter_name: 'Alex Johnson',
    item_name: 'Student ID Card - CS2026-089',
    report_type: 'found',
    description: 'Found official campus smart card near Cafeteria Block B entrance.',
    category: 'Documents',
    location: 'Cafeteria Block B',
    incident_date: '2026-09-13',
    image_url: null,
    status: 'open',
    contact_preference: 'In-App Request',
    created_at: '2026-09-13T10:00:00Z',
    updated_at: '2026-09-13T10:00:00Z'
  }
];

let MOCK_CONTACT_REQUESTS = [
  {
    id: 'req-101',
    item_id: 'lf-901',
    requester_id: 'user-892',
    requester_name: 'Emily Davis',
    message: 'Hi Alex, I found earbuds matching your description at the library today. Please connect with me!',
    status: 'pending',
    created_at: '2026-09-12T15:00:00Z'
  }
];

async function getItems(req, res) {
  try {
    const { report_type, category, location, status, search, my_items } = req.query;

    if (supabase) {
      let query = supabase.from('lost_found_items').select('*').order('created_at', { ascending: false });

      if (my_items === 'true') {
        query = query.eq('user_id', req.user.id);
      }
      if (report_type && report_type !== 'all') {
        query = query.eq('report_type', report_type);
      }
      if (category && category !== 'All') {
        query = query.ilike('category', `%${category}%`);
      }
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      if (search) {
        query = query.or(`item_name.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (!error && data) {
        return res.json({
          success: true,
          message: 'Lost & Found items retrieved',
          data,
          source: 'supabase'
        });
      }
    }

    // Mock Fallback Filter
    let list = [...MOCK_ITEMS];

    if (my_items === 'true') {
      list = list.filter(i => i.user_id === req.user.id);
    }
    if (report_type && report_type !== 'all') {
      list = list.filter(i => i.report_type.toLowerCase() === report_type.toLowerCase());
    }
    if (category && category !== 'All') {
      list = list.filter(i => i.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (status && status !== 'all') {
      list = list.filter(i => i.status.toLowerCase() === status.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(i =>
        i.item_name.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q)
      );
    }

    return res.json({
      success: true,
      message: 'Lost & Found items retrieved',
      data: list,
      source: 'mock'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve items', error: error.message });
  }
}

async function createItem(req, res) {
  try {
    const { item_name, report_type, description, category = 'Other', location, incident_date, image_url, contact_preference = 'In-App Request' } = req.body;

    if (!item_name || !report_type || !description || !location || !incident_date) {
      return res.status(400).json({
        success: false,
        message: 'Item name, report type (lost/found), description, location, and date are required.'
      });
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('lost_found_items')
        .insert([
          {
            user_id: req.user.id,
            item_name,
            report_type,
            description,
            category,
            location,
            incident_date,
            image_url: image_url || null,
            status: 'open',
            contact_preference
          }
        ])
        .select();

      if (!error && data && data.length > 0) {
        return res.status(201).json({
          success: true,
          message: `${report_type === 'lost' ? 'Lost item' : 'Found item'} report created in Supabase`,
          data: data[0],
          source: 'supabase'
        });
      }
    }

    // Mock Insertion
    const newItem = {
      id: `lf-${Date.now()}`,
      user_id: req.user.id,
      reporter_name: req.user.full_name || 'Campus User',
      item_name,
      report_type,
      description,
      category,
      location,
      incident_date,
      image_url: image_url || null,
      status: 'open',
      contact_preference,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    MOCK_ITEMS.unshift(newItem);

    return res.status(201).json({
      success: true,
      message: `${report_type === 'lost' ? 'Lost item' : 'Found item'} report posted successfully`,
      data: newItem,
      source: 'mock'
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create report', error: error.message });
  }
}

async function updateItemStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['open', 'claimed', 'returned', 'closed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('lost_found_items')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();

      if (!error && data && data.length > 0) {
        return res.json({
          success: true,
          message: `Item status updated to ${status}`,
          data: data[0],
          source: 'supabase'
        });
      }
    }

    const item = MOCK_ITEMS.find(i => i.id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Report item not found' });
    }

    item.status = status;
    item.updated_at = new Date().toISOString();

    return res.json({
      success: true,
      message: `Item status updated to ${status}`,
      data: item,
      source: 'mock'
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update item status', error: error.message });
  }
}

async function createContactRequest(req, res) {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Contact message is required' });
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('lost_found_contact_requests')
        .insert([
          {
            item_id: id,
            requester_id: req.user.id,
            requester_name: req.user.full_name || 'Student',
            message,
            status: 'pending'
          }
        ])
        .select();

      if (!error && data && data.length > 0) {
        return res.status(201).json({
          success: true,
          message: 'Contact request sent to item owner via Supabase',
          data: data[0],
          source: 'supabase'
        });
      }
    }

    const newReq = {
      id: `req-${Date.now()}`,
      item_id: id,
      requester_id: req.user.id,
      requester_name: req.user.full_name || 'Student',
      message,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    MOCK_CONTACT_REQUESTS.unshift(newReq);

    return res.status(201).json({
      success: true,
      message: 'Contact request sent to item reporter',
      data: newReq,
      source: 'mock'
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to send contact request', error: error.message });
  }
}

async function findMatches(req, res) {
  try {
    const { itemId } = req.body;
    let target = MOCK_ITEMS.find(i => i.id === itemId);

    if (supabase && itemId) {
      const { data } = await supabase.from('lost_found_items').select('*').eq('id', itemId).maybeSingle();
      if (data) target = data;
    }

    if (!target) {
      return res.status(404).json({ success: false, message: 'Target item not found for matching' });
    }

    // Find opposite type items (if target is lost, search found items)
    const oppositeType = target.report_type === 'lost' ? 'found' : 'lost';
    let pool = MOCK_ITEMS.filter(i => i.id !== target.id && i.report_type === oppositeType && i.status === 'open');

    if (supabase) {
      const { data } = await supabase
        .from('lost_found_items')
        .select('*')
        .eq('report_type', oppositeType)
        .eq('status', 'open')
        .neq('id', target.id);
      if (data && data.length > 0) pool = data;
    }

    // Keyword & Location Overlap Scoring
    const targetKeywords = `${target.item_name} ${target.category} ${target.location}`.toLowerCase().split(/\s+/);
    const scoredMatches = pool.map(item => {
      const itemText = `${item.item_name} ${item.category} ${item.location} ${item.description}`.toLowerCase();
      let matchScore = 0;

      targetKeywords.forEach(kw => {
        if (kw.length > 2 && itemText.includes(kw)) {
          matchScore += 25;
        }
      });

      if (item.category.toLowerCase() === target.category.toLowerCase()) matchScore += 30;
      if (item.location.toLowerCase() === target.location.toLowerCase()) matchScore += 20;

      return {
        ...item,
        matchScore: Math.min(matchScore, 98),
        isAIMatchSuggestion: true
      };
    }).filter(m => m.matchScore >= 20).sort((a, b) => b.matchScore - a.matchScore);

    // Optional Gemini AI suggestion summary
    let aiSummary = "AI Suggestion: Standard keyword matching found potential counterpart reports.";
    try {
      const aiPrompt = `Compare this ${target.report_type} item: "${target.item_name} at ${target.location}" with candidate items: ${scoredMatches.map(m => m.item_name).join(', ')}. Explain in 1-2 sentences why these might match.`;
      const aiRes = await generateCampusAIChat(aiPrompt);
      if (aiRes?.success && aiRes?.response) {
        aiSummary = `🤖 AI Matching Insight: ${aiRes.response}`;
      }
    } catch (e) {}

    return res.json({
      success: true,
      message: `Found ${scoredMatches.length} candidate match(es)`,
      data: {
        targetItem: target,
        matches: scoredMatches,
        aiSummary,
        disclaimer: 'AI matches are algorithmic suggestions only. Please verify item details directly with the reporter.'
      }
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to compute matches', error: error.message });
  }
}

module.exports = {
  getItems,
  createItem,
  updateItemStatus,
  createContactRequest,
  findMatches
};
