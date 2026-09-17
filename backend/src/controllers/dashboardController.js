/**
 * Dashboard Statistics Controller
 * Provides customized dashboard metrics based on user role (student, faculty, admin)
 */

async function getDashboardStats(req, res) {
  try {
    const role = req.user.role || 'student';

    if (role === 'admin') {
      return res.json({
        success: true,
        message: 'Admin metrics retrieved',
        data: {
          totalUsers: 1420,
          totalStudents: 1250,
          totalFaculty: 120,
          totalAdmins: 50,
          activeCourses: 34,
          openComplaints: 8,
          overallAttendance: '84.2%',
          assignmentSubmissionRate: '91.5%',
          recentActivities: [
            { id: 1, type: 'notice', title: 'Mid-Term Exam Schedule Released', time: '2 hours ago' },
            { id: 2, type: 'complaint', title: 'Hostel Block B WiFi Issue Reported', time: '4 hours ago' },
            { id: 3, type: 'event', title: 'Annual TechFest 2026 Registration Open', time: '1 day ago' }
          ]
        }
      });
    }

    if (role === 'faculty') {
      return res.json({
        success: true,
        message: 'Faculty metrics retrieved',
        data: {
          assignedCourses: 4,
          totalStudentsTaught: 180,
          pendingAssignmentsToGrade: 14,
          avgClassAttendance: '86.4%',
          recentComplaintsAssigned: 2,
          upcomingDeadlines: [
            { id: 101, title: 'Database Systems Project 1', course: 'CSE-301', dueDate: '2026-09-20' },
            { id: 102, title: 'Data Structures Lab Evaluation', course: 'CSE-202', dueDate: '2026-09-25' }
          ]
        }
      });
    }

    // Default Student View
    return res.json({
      success: true,
      message: 'Student metrics retrieved',
      data: {
        attendancePercentage: 88.5,
        totalClassesAttended: 142,
        totalClassesHeld: 160,
        pendingAssignments: 3,
        completedAssignments: 12,
        openComplaints: 1,
        activeStudyPlans: 2,
        upcomingDeadlines: [
          { id: 201, title: 'Advanced Algorithms Assignment 2', subject: 'CSE-304', dueIn: '2 days', status: 'Pending' },
          { id: 202, title: 'Operating Systems Quiz', subject: 'CSE-302', dueIn: '5 days', status: 'Upcoming' }
        ],
        recentNotices: [
          { id: 301, title: 'Campus Placement Drive by Tech Corp', category: 'Placement', date: 'Today' },
          { id: 302, title: 'Holiday Announcement - National Fest', category: 'General', date: 'Yesterday' }
        ]
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard stats',
      error: error.message
    });
  }
}

module.exports = {
  getDashboardStats
};
