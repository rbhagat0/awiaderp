import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { User, Plus, Trash2, Edit3, Mail, ShieldCheck } from 'lucide-react';

export default function EmployeeManagement() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    email: '',
    password: '',
    name: '',
    role: 'employee',
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ email: '', name: '', role: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.role === 'company_admin') {
      fetchEmployees();
    }
  }, [user]);

  if (user?.role !== 'company_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-premium-dark dark:bg-premium-dark">
        <div className="glass-panel p-8 md:p-12 max-w-md w-full">
          <h1 className="section-title">Access Denied</h1>
          <p className="section-subtitle mt-2">Company Admin access required.</p>
        </div>
      </div>
    );
  }

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    try {
      await api.post('/employees', newEmployee);
      setShowForm(false);
      setNewEmployee({ email: '', password: '', name: '', role: 'employee' });
      fetchEmployees();
      setMessage('Employee created successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to create employee');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/employees/${editingId}`, editData);
      setEditingId(null);
      fetchEmployees();
      setMessage('Employee updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to update employee');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await api.delete(`/employees/${id}`);
      fetchEmployees();
      setMessage('Employee deleted successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to delete employee');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleEdit = (emp) => {
    setEditingId(emp.id);
    setEditData({ email: emp.email, name: emp.name, role: emp.role });
  };

  const roleOptions = ['employee', 'company_admin'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Employee Management</h1>
          <p className="section-subtitle">
            Enroll and manage employees for {user?.company_name || 'your company'}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-premium-success/10 dark:bg-premium-success/10 text-premium-success dark:text-premium-success text-sm border border-premium-success/20">
          {message}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-premium-textMuted dark:text-premium-textMuted">
          Loading employees...
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td className="font-medium">{emp.name}</td>
                  <td className="text-premium-textMuted dark:text-premium-textMuted">{emp.email}</td>
                  <td>
                    <span className={`badge ${
                      emp.role === 'company_admin'
                        ? 'badge-active'
                        : 'badge-trial'
                    }`}>
                      {emp.role.charAt(0).toUpperCase() + emp.role.slice(1)}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => handleEdit(emp)}
                        className="p-2.5 text-premium-accent dark:text-premium-accent hover:bg-premium-accent/10 dark:hover:bg-premium-accent/20 rounded-xl transition-all"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(emp.id)}
                        className="p-2.5 text-premium-error dark:text-premium-error hover:bg-premium-error/10 dark:hover:bg-premium-error/20 rounded-xl transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-premium-textMuted dark:text-premium-textMuted">
                    No employees yet. Add your first employee.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-premium-text dark:text-premium-text mb-4">Add New Employee</h2>
          <form onSubmit={handleCreateEmployee} className="space-y-5 max-w-md">
            <div>
              <label className="block text-sm font-medium text-premium-textMuted dark:text-premium-textMuted mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                className="input-field"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-premium-textMuted dark:text-premium-textMuted mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                className="input-field"
                placeholder="john@company.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-premium-textMuted dark:text-premium-textMuted mb-2">
                Password
              </label>
              <input
                type="password"
                value={newEmployee.password}
                onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-premium-textMuted dark:text-premium-textMuted mb-2">
                Role
              </label>
              <select
                value={newEmployee.role}
                onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                className="select-field"
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-6">
              <button type="submit" className="btn-primary flex-1">
                Create Employee
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {editingId && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-premium-text dark:text-premium-text mb-4">Edit Employee</h2>
          <form onSubmit={handleUpdateEmployee} className="space-y-5 max-w-md">
            <div>
              <label className="block text-sm font-medium text-premium-textMuted dark:text-premium-textMuted mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-premium-textMuted dark:text-premium-textMuted mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-premium-textMuted dark:text-premium-textMuted mb-2">
                Role
              </label>
              <select
                value={editData.role}
                onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                className="select-field"
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-6">
              <button type="submit" className="btn-primary flex-1">
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
