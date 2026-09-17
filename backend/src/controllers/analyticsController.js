const { supabase } = require('../config/supabase');

async function getAnalyticsData(req, res) {
  try {
    let totals = {
      studentsCount: 1250,
      facultyCount: 120,
      openComplaints: 8,
      resolvedComplaints: 48,
      activeEvents: 3,
      lostFoundCount: 12,
      noticeCount: 15
    };

    if (supabase) {
      try {
        const [
          { count: students },
          { count: faculty },
          { count: openCmp },
          { count: resCmp },
          { count: evts },
          { count: lfItems }
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'faculty'),
          supabase.from('complaints').select('*', { count: 'exact', head: true }).in('status', ['Open', 'Submitted', 'In Progress', 'Reopened']),
          supabase.from('complaints').select('*', { count: 'exact', head: true }).eq('status', 'Resolved'),
          supabase.from('events').select('*', { count: 'exact', head: true }),
          supabase.from('lost_found_items').select('*', { count: 'exact', head: true })
        ]);

        totals = {
          studentsCount: students || totals.studentsCount,
          facultyCount: faculty || totals.facultyCount,
          openComplaints: openCmp !== null ? openCmp : totals.openComplaints,
          resolvedComplaints: resCmp !== null ? resCmp : totals.resolvedComplaints,
          activeEvents: evts !== null ? evts : totals.activeEvents,
          lostFoundCount: lfItems !== null ? lfItems : totals.lostFoundCount,
          noticeCount: 15
        };
      } catch (err) {
        console.warn('Analytics DB count warning:', err.message);
      }
    }

    return res.json({
      success: true,
      message: 'Campus analytics data retrieved',
      data: {
        summary: totals,
        attendanceTrend: [
          { month: 'Jan', averagePercentage: 88.2 },
          { month: 'Feb', averagePercentage: 86.5 },
          { month: 'Mar', averagePercentage: 89.1 },
          { month: 'Apr', averagePercentage: 84.7 },
          { month: 'May', averagePercentage: 91.0 },
          { month: 'Jun', averagePercentage: 87.4 }
        ],
        assignmentCompletionRate: [
          { course: 'CSE-301 DBMS', completed: 94, pending: 6 },
          { course: 'CSE-302 OS', completed: 88, pending: 12 },
          { course: 'CSE-303 Networks', completed: 81, pending: 19 },
          { course: 'CSE-304 Algorithms', completed: 92, pending: 8 },
          { course: 'CSE-305 Software Engg', completed: 85, pending: 15 }
        ],
        complaintStatusDistribution: [
          { status: 'Resolved', count: totals.resolvedComplaints },
          { status: 'In Progress', count: 14 },
          { status: 'Open', count: totals.openComplaints },
          { status: 'Rejected', count: 3 }
        ],
        userRoleDistribution: [
          { role: 'Students', count: totals.studentsCount },
          { role: 'Faculty', count: totals.facultyCount },
          { role: 'Admin Staff', count: 50 }
        ],
        departmentMetrics: [
          { name: 'Computer Science', students: 520, faculty: 45, courses: 14 },
          { name: 'Information Tech', students: 410, faculty: 38, courses: 10 },
          { name: 'Electronics & Comm', students: 320, faculty: 37, courses: 10 }
        ]
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve analytics', error: error.message });
  }
}

module.exports = {
  getAnalyticsData
};

