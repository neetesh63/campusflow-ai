/**
 * Attendance Controller
 */

// In-memory attendance database fallback
let MOCK_ATTENDANCE = [
  { id: 'att-1', student_id: 'student-id-303', course_code: 'CSE-301', course_name: 'Database Management Systems', date: '2026-09-12', status: 'present', marked_by: 'Prof. Alan Turing' },
  { id: 'att-2', student_id: 'student-id-303', course_code: 'CSE-302', course_name: 'Operating Systems', date: '2026-09-12', status: 'present', marked_by: 'Prof. Sarah Jenkins' },
  { id: 'att-3', student_id: 'student-id-303', course_code: 'CSE-303', course_name: 'Computer Networks', date: '2026-09-11', status: 'absent', marked_by: 'Dr. Robert Vance' },
  { id: 'att-4', student_id: 'student-id-303', course_code: 'CSE-304', course_name: 'Design & Analysis of Algorithms', date: '2026-09-10', status: 'present', marked_by: 'Prof. Alan Turing' },
  { id: 'att-5', student_id: 'student-id-303', course_code: 'CSE-305', course_name: 'Software Engineering', date: '2026-09-10', status: 'late', marked_by: 'Prof. Emily Blunt' },
];

let MOCK_COURSE_SUMMARY = [
  { course_code: 'CSE-301', course_name: 'Database Management Systems', total_classes: 32, attended: 30, percentage: 93.75, status: 'good' },
  { course_code: 'CSE-302', course_name: 'Operating Systems', total_classes: 30, attended: 26, percentage: 86.66, status: 'good' },
  { course_code: 'CSE-303', course_name: 'Computer Networks', total_classes: 28, attended: 20, percentage: 71.42, status: 'warning' },
  { course_code: 'CSE-304', course_name: 'Design & Analysis of Algorithms', total_classes: 35, attended: 32, percentage: 91.42, status: 'good' },
  { course_code: 'CSE-305', course_name: 'Software Engineering', total_classes: 25, attended: 21, percentage: 84.00, status: 'good' },
const { supabase } = require('../config/supabase');

async function getAttendanceRecords(req, res) {
  try {
    const studentId = req.query.student_id || req.user?.id;
    const isDemo = Boolean(req.user?.is_demo);

    // If Demo user, return presentation mock attendance
    if (isDemo) {
      const overallAttended = MOCK_COURSE_SUMMARY.reduce((acc, curr) => acc + curr.attended, 0);
      const overallTotal = MOCK_COURSE_SUMMARY.reduce((acc, curr) => acc + curr.total_classes, 0);
      const overallPercentage = ((overallAttended / overallTotal) * 100).toFixed(1);

      return res.json({
        success: true,
        message: 'Attendance records retrieved (Demo Mode)',
        data: {
          overallPercentage: parseFloat(overallPercentage),
          overallAttended,
          overallTotal,
          lowAttendanceWarning: overallPercentage < 75,
          courseSummary: MOCK_COURSE_SUMMARY,
          recentLogs: MOCK_ATTENDANCE
        }
      });
    }

    // For Real user, fetch actual attendance records from Supabase
    let courseSummary = [];
    let recentLogs = [];
    let overallAttended = 0;
    let overallTotal = 0;
    let overallPercentage = 0;

    if (supabase && studentId) {
      const { data: attLogs, error } = await supabase
        .from('attendance')
        .select('*, courses(name, code)')
        .eq('student_id', studentId)
        .order('date', { ascending: false });

      if (!error && attLogs && attLogs.length > 0) {
        recentLogs = attLogs.map(a => ({
          id: a.id,
          student_id: a.student_id,
          course_code: a.courses?.code || 'Course',
          course_name: a.courses?.name || 'Course Name',
          date: a.date,
          status: a.status,
          marked_by: a.marked_by || 'Faculty'
        }));

        overallTotal = recentLogs.length;
        overallAttended = recentLogs.filter(l => l.status === 'present').length;
        overallPercentage = parseFloat(((overallAttended / overallTotal) * 100).toFixed(1));
      }
    }

    return res.json({
      success: true,
      message: 'Attendance records retrieved',
      data: {
        overallPercentage,
        overallAttended,
        overallTotal,
        lowAttendanceWarning: overallTotal > 0 && overallPercentage < 75,
        courseSummary,
        recentLogs
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving attendance', error: error.message });
  }
}

async function markAttendance(req, res) {
  try {
    const { course_code, date, student_records } = req.body;

    if (!course_code || !student_records || !Array.isArray(student_records)) {
      return res.status(400).json({ success: false, message: 'Invalid payload. Course code and student_records array are required.' });
    }

    const newLogs = [];
    student_records.forEach(item => {
      const entry = {
        id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        student_id: item.student_id || 'student-id-303',
        course_code,
        course_name: item.course_name || 'Course',
        date: date || new Date().toISOString().split('T')[0],
        status: item.status || 'present',
        marked_by: req.user.full_name
      };
      MOCK_ATTENDANCE.unshift(entry);
      newLogs.push(entry);
    });

    return res.json({
      success: true,
      message: `Attendance marked successfully for ${student_records.length} student(s)`,
      data: newLogs
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to mark attendance', error: error.message });
  }
}

module.exports = {
  getAttendanceRecords,
  markAttendance
};
