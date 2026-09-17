const { supabase } = require('../config/supabase');

let MOCK_EVENTS = [
  {
    id: 'evt-101',
    title: 'HackCampus 2026 - 36-Hour Hackathon',
    description: 'Build AI & IoT solutions for real-world campus challenges. Hackathon prize pool worth $5,000 + Internship opportunities!',
    venue: 'Main University Auditorium & Innovation Hub',
    event_date: '2026-10-10',
    event_time: '09:00 AM - 09:00 PM (Next Day)',
    organizer: 'Department of Computer Science & ACM Student Chapter',
    category: 'Hackathon',
    capacity: 150,
    banner_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500'
  },
  {
    id: 'evt-102',
    title: 'Guest Lecture: Responsible AI & Future of Cloud Architectures',
    description: 'Distinguished lecture series hosted by IBM Senior Engineers on Generative AI, enterprise microservices, and hybrid cloud.',
    venue: 'Seminar Hall 3, Science Complex',
    event_date: '2026-09-28',
    event_time: '02:00 PM - 04:30 PM',
    organizer: 'IEEE Student Branch',
    category: 'Workshop',
    capacity: 80,
    banner_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500'
  },
  {
    id: 'evt-103',
    title: 'Inter-College Sports Tournament 2026',
    description: 'Football, Basketball, Table Tennis, and Chess championships across 12 participating technical institutions.',
    venue: 'University Sports Complex & Ground',
    event_date: '2026-10-02',
    event_time: '08:00 AM onwards',
    organizer: 'Campus Athletics Committee',
    category: 'Sports',
    capacity: 300,
    banner_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500'
  }
];

let MOCK_REGISTRATIONS = [
  { id: 'reg-1', event_id: 'evt-101', student_id: 'student-id-303', registered_at: new Date().toISOString() }
];

async function getEvents(req, res) {
  try {
    const { category, search } = req.query;

    if (supabase) {
      let query = supabase.from('events').select('*, event_registrations(id, student_id)').order('event_date', { ascending: true });
      if (category && category !== 'All') query = query.ilike('category', category);
      if (search) query = query.or(`title.ilike.%${search}%,venue.ilike.%${search}%`);

      const { data, error } = await query;
      if (!error && data) {
        const eventsWithStats = data.map(e => {
          const regs = e.event_registrations || [];
          const isRegistered = regs.some(r => r.student_id === req.user?.id);
          return {
            ...e,
            registeredCount: regs.length,
            isRegistered
          };
        });

        return res.json({
          success: true,
          message: 'Events list retrieved from Supabase',
          data: eventsWithStats,
          source: 'supabase'
        });
      }
    }

    let list = MOCK_EVENTS.map(e => {
      const isRegistered = MOCK_REGISTRATIONS.some(r => r.event_id === e.id && r.student_id === req.user?.id);
      const registeredCount = MOCK_REGISTRATIONS.filter(r => r.event_id === e.id).length;
      return { ...e, isRegistered, registeredCount };
    });

    if (category && category !== 'All') {
      list = list.filter(e => e.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(e => e.title.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q));
    }

    return res.json({
      success: true,
      message: 'Events list retrieved',
      data: list,
      source: 'mock'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch events', error: error.message });
  }
}

async function createEvent(req, res) {
  try {
    const { title, description, venue, event_date, event_time, category = 'General', capacity = 100 } = req.body;

    if (!title || !venue || !event_date || !event_time) {
      return res.status(400).json({ success: false, message: 'Title, venue, date, and time are required' });
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            title,
            description: description || '',
            venue,
            event_date,
            event_time,
            category,
            capacity: parseInt(capacity) || 100,
            organizer_id: req.user.id
          }
        ])
        .select();

      if (!error && data && data.length > 0) {
        return res.status(201).json({
          success: true,
          message: 'Event created successfully in Supabase',
          data: data[0],
          source: 'supabase'
        });
      }
    }

    const newEvent = {
      id: `evt-${Date.now()}`,
      title,
      description: description || '',
      venue,
      event_date,
      event_time,
      organizer: req.user.full_name || 'Campus Event Committee',
      category,
      capacity: parseInt(capacity) || 100,
      created_at: new Date().toISOString()
    };

    MOCK_EVENTS.unshift(newEvent);

    return res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent,
      source: 'mock'
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create event', error: error.message });
  }
}

async function registerForEvent(req, res) {
  try {
    const { id } = req.params;
    const studentId = req.user.id;

    if (supabase) {
      // Check existing registration
      const { data: existing } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_id', id)
        .eq('student_id', studentId)
        .maybeSingle();

      if (existing) {
        return res.status(400).json({ success: false, message: 'You have already registered for this event.' });
      }

      const { data, error } = await supabase
        .from('event_registrations')
        .insert([{ event_id: id, student_id: studentId }])
        .select();

      if (!error && data) {
        return res.status(201).json({
          success: true,
          message: 'Successfully registered for event!',
          data: data[0],
          source: 'supabase'
        });
      }
    }

    const existingMock = MOCK_REGISTRATIONS.find(r => r.event_id === id && r.student_id === studentId);
    if (existingMock) {
      return res.status(400).json({ success: false, message: 'You are already registered for this event.' });
    }

    const newReg = { id: `reg-${Date.now()}`, event_id: id, student_id: studentId, registered_at: new Date().toISOString() };
    MOCK_REGISTRATIONS.push(newReg);

    return res.status(201).json({
      success: true,
      message: 'Successfully registered for event!',
      data: newReg,
      source: 'mock'
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to register for event', error: error.message });
  }
}

async function cancelEventRegistration(req, res) {
  try {
    const { id } = req.params;
    const studentId = req.user.id;

    if (supabase) {
      const { error } = await supabase
        .from('event_registrations')
        .delete()
        .eq('event_id', id)
        .eq('student_id', studentId);

      if (!error) {
        return res.json({ success: true, message: 'Registration cancelled successfully.' });
      }
    }

    MOCK_REGISTRATIONS = MOCK_REGISTRATIONS.filter(r => !(r.event_id === id && r.student_id === studentId));
    return res.json({ success: true, message: 'Registration cancelled successfully.' });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to cancel registration', error: error.message });
  }
}

async function getMyRegistrations(req, res) {
  try {
    const studentId = req.user.id;

    if (supabase) {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*, events(*)')
        .eq('student_id', studentId);

      if (!error && data) {
        return res.json({ success: true, data: data.map(d => d.events) });
      }
    }

    const eventIds = MOCK_REGISTRATIONS.filter(r => r.student_id === studentId).map(r => r.event_id);
    const events = MOCK_EVENTS.filter(e => eventIds.includes(e.id));
    return res.json({ success: true, data: events });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to get registrations', error: error.message });
  }
}

module.exports = {
  getEvents,
  createEvent,
  registerForEvent,
  cancelEventRegistration,
  getMyRegistrations
};

