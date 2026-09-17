const { supabase } = require('../config/supabase');

// In-memory notifications store for Demo Mode
let MOCK_NOTIFICATIONS = [
  {
    id: 'notif-101',
    user_id: 'student-id-303',
    type: 'notice',
    title: 'Mid-Semester Exam Schedule Published',
    message: 'The official 5th semester examination datesheet is available under the Notices tab.',
    related_entity_id: 'notice-1',
    is_read: false,
    is_demo: true,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 mins ago
  },
  {
    id: 'notif-102',
    user_id: 'student-id-303',
    type: 'complaint',
    title: 'Hostel WiFi Complaint Resolved',
    message: 'Ticket #cmp-502 regarding Hostel Block C WiFi router has been marked Resolved by IT admin.',
    related_entity_id: 'cmp-502',
    is_read: false,
    is_demo: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() // 3 hours ago
  },
  {
    id: 'notif-103',
    user_id: 'student-id-303',
    type: 'event',
    title: 'HackCampus 2026 Registration Confirmed',
    message: 'Your registration for HackCampus 36-Hour Hackathon has been confirmed by event managers.',
    related_entity_id: 'evt-101',
    is_read: true,
    is_demo: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
  },
  {
    id: 'notif-104',
    user_id: 'student-id-303',
    type: 'lost_found',
    title: 'Lost Item Contact Request Received',
    message: 'A student sent an in-app request regarding your reported Lost HP Laptop Charger.',
    related_entity_id: 'lf-1',
    is_read: true,
    is_demo: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() // 2 days ago
  }
];

async function getNotifications(req, res) {
  try {
    const userId = req.user?.id;
    const isDemoUser = !userId || userId.startsWith('student-id-') || userId.startsWith('faculty-id-') || userId.startsWith('admin-id-');

    if (supabase && !isDemoUser) {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const unreadCount = data.filter(n => !n.is_read).length;
        return res.json({
          success: true,
          message: 'Notifications retrieved from Supabase',
          data: {
            notifications: data,
            unreadCount
          },
          source: 'supabase'
        });
      }
    }

    // Demo Mode or Fallback Mode
    // Filter for current demo role/user
    const userNotifs = MOCK_NOTIFICATIONS.filter(n => n.user_id === userId || isDemoUser);
    const unreadCount = userNotifs.filter(n => !n.is_read).length;

    return res.json({
      success: true,
      message: 'Notifications retrieved',
      data: {
        notifications: userNotifs,
        unreadCount
      },
      source: 'mock'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve notifications',
      error: error.message
    });
  }
}

async function markAsRead(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const isDemoUser = !userId || userId.startsWith('student-id-') || userId.startsWith('faculty-id-') || userId.startsWith('admin-id-');

    if (supabase && !isDemoUser) {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .eq('user_id', userId)
        .select();

      if (!error && data && data.length > 0) {
        return res.json({
          success: true,
          message: 'Notification marked as read',
          data: data[0],
          source: 'supabase'
        });
      }
    }

    const notif = MOCK_NOTIFICATIONS.find(n => n.id === id);
    if (notif) {
      notif.is_read = true;
    }

    return res.json({
      success: true,
      message: 'Notification marked as read',
      data: notif || { id, is_read: true },
      source: 'mock'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
}

async function markAllAsRead(req, res) {
  try {
    const userId = req.user?.id;
    const isDemoUser = !userId || userId.startsWith('student-id-') || userId.startsWith('faculty-id-') || userId.startsWith('admin-id-');

    if (supabase && !isDemoUser) {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false)
        .select();

      if (!error) {
        return res.json({
          success: true,
          message: 'All notifications marked as read',
          source: 'supabase'
        });
      }
    }

    MOCK_NOTIFICATIONS.forEach(n => {
      if (n.user_id === userId || isDemoUser) {
        n.is_read = true;
      }
    });

    return res.json({
      success: true,
      message: 'All notifications marked as read',
      source: 'mock'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: error.message
    });
  }
}

async function createNotification(req, res) {
  try {
    const { user_id, type = 'general', title, message, related_entity_id } = req.body;

    if (!user_id || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'user_id, title, and message are required'
      });
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{ user_id, type, title, message, related_entity_id }])
        .select();

      if (!error && data) {
        return res.status(201).json({
          success: true,
          message: 'Notification created successfully in Supabase',
          data: data[0],
          source: 'supabase'
        });
      }
    }

    const newNotif = {
      id: `notif-${Date.now()}`,
      user_id,
      type,
      title,
      message,
      related_entity_id: related_entity_id || null,
      is_read: false,
      is_demo: false,
      created_at: new Date().toISOString()
    };

    MOCK_NOTIFICATIONS.unshift(newNotif);

    return res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: newNotif,
      source: 'mock'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create notification',
      error: error.message
    });
  }
}

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification
};
