import React, { useState } from 'react';
import TopNavbar from '../components/TopNavbar';
import Sidebar from '../components/Sidebar';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import { RoleGuard } from '../components/ProtectedRoute';
import { useToast } from '../context/ToastContext';
import { Building2, PlusCircle } from 'lucide-react';

export default function CourseManagementPage() {
  const { toast } = useToast();
  const [courses, setCourses] = useState([
    { id: 'c1', code: 'CSE-301', name: 'Database Management Systems', department: 'Computer Science', semester: '5', faculty: 'Prof. Alan Turing' },
    { id: 'c2', code: 'CSE-302', name: 'Operating Systems', department: 'Computer Science', semester: '5', faculty: 'Prof. Sarah Jenkins' },
    { id: 'c3', code: 'CSE-303', name: 'Computer Networks', department: 'Computer Science', semester: '5', faculty: 'Dr. Robert Vance' },
    { id: 'c4', code: 'IT-201', name: 'Web Application Architectures', department: 'Information Tech', semester: '3', faculty: 'Prof. Emily Blunt' },
    { id: 'c5', code: 'ECE-101', name: 'Digital Logic Circuits', department: 'Electronics & Comm', semester: '1', faculty: 'Dr. Michael Chang' },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ code: '', name: '', department: 'Computer Science', semester: '5', faculty: 'Prof. Alan Turing' });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newCourse.code || !newCourse.name) {
      toast.error('Course code and name are required');
      return;
    }
    const created = { id: String(Date.now()), ...newCourse };
    setCourses([created, ...courses]);
    toast.success(`Course ${newCourse.code}: ${newCourse.name} added to catalog`);
    setIsAddModalOpen(false);
    setNewCourse({ code: '', name: '', department: 'Computer Science', semester: '5', faculty: 'Prof. Alan Turing' });
  };

  const columns = [
    { header: 'Course Code', accessor: 'code', render: (r) => <span className="font-bold text-cyan-400">{r.code}</span> },
    { header: 'Course Name', accessor: 'name', render: (r) => <span className="font-bold text-white">{r.name}</span> },
    { header: 'Department', accessor: 'department' },
    { header: 'Semester', accessor: 'semester' },
    { header: 'Faculty Lead', accessor: 'faculty' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <TopNavbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <RoleGuard allowedRoles={['admin', 'faculty']}>
            <PageHeader
              title="Departments & Academic Courses Catalog"
              subtitle="Manage academic departments, course codes, semester allocations, and faculty assignments"
              action={
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
                >
                  <PlusCircle className="w-4 h-4" /> Add New Course
                </button>
              }
            />

            <DataTable columns={columns} data={courses} searchPlaceholder="Search courses by code, name, or faculty..." />

            {/* Add Course Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Course to Catalog">
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Course Code" required>
                    <input
                      type="text"
                      placeholder="CSE-401"
                      value={newCourse.code}
                      onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                    />
                  </FormField>

                  <FormField label="Semester">
                    <input
                      type="number"
                      placeholder="7"
                      value={newCourse.semester}
                      onChange={(e) => setNewCourse({ ...newCourse, semester: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                    />
                  </FormField>
                </div>

                <FormField label="Course Title" required>
                  <input
                    type="text"
                    placeholder="Distributed Cloud Architectures"
                    value={newCourse.name}
                    onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Department">
                    <select
                      value={newCourse.department}
                      onChange={(e) => setNewCourse({ ...newCourse, department: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Tech">Information Tech</option>
                      <option value="Electronics & Comm">Electronics & Comm</option>
                    </select>
                  </FormField>

                  <FormField label="Assigned Faculty Lead">
                    <input
                      type="text"
                      placeholder="Prof. Alan Turing"
                      value={newCourse.faculty}
                      onChange={(e) => setNewCourse({ ...newCourse, faculty: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                    />
                  </FormField>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                  >
                    Create Course
                  </button>
                </div>
              </form>
            </Modal>
          </RoleGuard>
        </main>
      </div>
    </div>
  );
}
