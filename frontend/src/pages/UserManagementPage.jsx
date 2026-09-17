import React, { useState } from 'react';
import TopNavbar from '../components/TopNavbar';
import Sidebar from '../components/Sidebar';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import { RoleGuard } from '../components/ProtectedRoute';
import { useToast } from '../context/ToastContext';
import { Users, UserPlus, Shield, Edit, Trash2 } from 'lucide-react';

export default function UserManagementPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState([
    { id: '1', full_name: 'Alex Johnson', email: 'student@campusflow.edu', role: 'student', department: 'Computer Science', status: 'Active' },
    { id: '2', full_name: 'Prof. Alan Turing', email: 'faculty@campusflow.edu', role: 'faculty', department: 'Computer Science', status: 'Active' },
    { id: '3', full_name: 'Dr. Sarah Connor', email: 'admin@campusflow.edu', role: 'admin', department: 'Administration', status: 'Active' },
    { id: '4', full_name: 'Emily Davis', email: 'emily@campusflow.edu', role: 'student', department: 'Information Tech', status: 'Active' },
    { id: '5', full_name: 'Dr. Robert Vance', email: 'vance@campusflow.edu', role: 'faculty', department: 'Electronics & Comm', status: 'Active' },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ full_name: '', email: '', role: 'student', department: 'Computer Science' });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newUser.full_name || !newUser.email) {
      toast.error('Name and email are required');
      return;
    }
    const created = { id: String(Date.now()), ...newUser, status: 'Active' };
    setUsers([created, ...users]);
    toast.success(`User ${newUser.full_name} created with role ${newUser.role.toUpperCase()}`);
    setIsAddModalOpen(false);
    setNewUser({ full_name: '', email: '', role: 'student', department: 'Computer Science' });
  };

  const handleRoleChange = (id, newRole) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    toast.success(`User role updated to ${newRole.toUpperCase()}`);
  };

  const columns = [
    { header: 'Full Name', accessor: 'full_name', render: (r) => <span className="font-bold text-white">{r.full_name}</span> },
    { header: 'Email Address', accessor: 'email' },
    {
      header: 'Role',
      accessor: 'role',
      render: (r) => (
        <select
          value={r.role}
          onChange={(e) => handleRoleChange(r.id, e.target.value)}
          className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold capitalize text-cyan-400 focus:outline-none"
        >
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="admin">Admin</option>
        </select>
      )
    },
    { header: 'Department', accessor: 'department' },
    {
      header: 'Status',
      accessor: 'status',
      render: (r) => (
        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
          {r.status}
        </span>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <TopNavbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <RoleGuard allowedRoles={['admin']}>
            <PageHeader
              title="User & Access Governance"
              subtitle="Provision accounts, assign role permissions (Student, Faculty, Admin), and update user status"
              action={
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
                >
                  <UserPlus className="w-4 h-4" /> Provision New User
                </button>
              }
            />

            <DataTable columns={columns} data={users} searchPlaceholder="Search users by name or email..." />

            {/* Add User Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Provision New User Account">
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <FormField label="Full Name" required>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    value={newUser.full_name}
                    onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                  />
                </FormField>

                <FormField label="Email Address" required>
                  <input
                    type="email"
                    placeholder="jane@campusflow.edu"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Assigned Role" required>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                    >
                      <option value="student">Student</option>
                      <option value="faculty">Faculty</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </FormField>

                  <FormField label="Department">
                    <input
                      type="text"
                      placeholder="Computer Science"
                      value={newUser.department}
                      onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
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
                    Create Account
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
