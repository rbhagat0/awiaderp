import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Plus, Trash2, Edit3 } from 'lucide-react';

export default function MasterAdminPage() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [companyForm, setCompanyForm] = useState({
    name: '',
    subscription_tier: 'starter',
    status: 'active',
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    admin_name: '',
    admin_email: '',
    admin_password: '',
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (user?.role === 'super_admin') {
      fetchCompanies();
    }
  }, [user]);

  if (user?.role !== 'super_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Super Admin access required.</p>
        </div>
      </div>
    );
  }

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/companies');
      setCompanies(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingCompany(null);
    setCompanyForm({
      name: '',
      subscription_tier: 'starter',
      status: 'active',
      contact_person: '',
      contact_email: '',
      contact_phone: '',
      address: '',
      admin_name: '',
      admin_email: '',
      admin_password: '',
    });
    setShowModal(true);
  };

  const openEditModal = (company) => {
    setEditingCompany(company.id);
    setCompanyForm({
      name: company.name || '',
      subscription_tier: company.subscription_tier || 'starter',
      status: company.status || 'active',
      contact_person: company.contact_person || '',
      contact_email: company.contact_email || '',
      contact_phone: company.contact_phone || '',
      address: company.address || '',
      admin_name: '',
      admin_email: '',
      admin_password: '',
    });
    setShowModal(true);
  };

  const handleSaveCompany = async (e) => {
    e.preventDefault();
    try {
      if (editingCompany) {
        await api.patch(`/companies/${editingCompany}`, {
          name: companyForm.name,
          subscription_tier: companyForm.subscription_tier,
          status: companyForm.status,
          contact_person: companyForm.contact_person,
          contact_email: companyForm.contact_email,
          contact_phone: companyForm.contact_phone,
          address: companyForm.address,
        });
        setMessage('Company updated successfully');
      } else {
        await api.post('/companies', {
          name: companyForm.name,
          subscription_tier: companyForm.subscription_tier,
          status: companyForm.status,
          contact_person: companyForm.contact_person,
          contact_email: companyForm.contact_email,
          contact_phone: companyForm.contact_phone,
          address: companyForm.address,
          admin_name: companyForm.admin_name,
          admin_email: companyForm.admin_email,
          admin_password: companyForm.admin_password,
        });
        setMessage('Company created successfully with admin account');
      }
      setShowModal(false);
      setEditingCompany(null);
      fetchCompanies();
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to save company');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteCompany = async (id) => {
    if (!window.confirm('Are you sure you want to delete this company? All related data (users, clients, leads, projects, tasks) will be permanently deleted.')) {
      return;
    }
    setDeletingId(id);
    try {
      await api.delete(`/companies/${id}`);
      setMessage('Company deleted successfully');
      setMessageType('success');
      fetchCompanies();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to delete company');
      setMessageType('error');
    } finally {
      setDeletingId(null);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleUpdateCompany = async (id, tier, status) => {
    try {
      await api.patch(`/companies/${id}`, { subscription_tier: tier, status });
      fetchCompanies();
    } catch (err) {
      console.error(err);
    }
  };

  const tierOptions = ['starter', 'professional', 'enterprise'];
  const statusOptions = ['active', 'suspended', 'trial'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Master Admin</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage onboarded companies and subscription tiers
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Company
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm border ${
          messageType === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800/30'
            : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800/30'
        }`}>
          {message}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          Loading companies...
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">Company Name</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">Tier</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{company.name}</td>
                  <td className="px-6 py-4">
                    <select
                      value={company.subscription_tier}
                      onChange={(e) => handleUpdateCompany(company.id, e.target.value, company.status)}
                      className="text-sm bg-transparent border-none text-gray-600 dark:text-gray-300 focus:ring-0"
                    >
                      {tierOptions.map((tier) => (
                        <option key={tier} value={tier}>
                          {tier.charAt(0).toUpperCase() + tier.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={company.status}
                      onChange={(e) => handleUpdateCompany(company.id, company.subscription_tier, e.target.value)}
                      className="text-sm bg-transparent border-none text-gray-600 dark:text-gray-300 focus:ring-0"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      company.status === 'active'
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                        : company.status === 'suspended'
                        ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                        : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                    }`}>
                      {company.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(company)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                        title="Edit Company"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCompany(company.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        title="Delete Company"
                        disabled={deletingId === company.id}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingCompany ? 'Edit Company' : 'Add New Company'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCompany} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                  className="input-field"
                  placeholder="Acme Corporation"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subscription Tier
                  </label>
                  <select
                    value={companyForm.subscription_tier}
                    onChange={(e) => setCompanyForm({ ...companyForm, subscription_tier: e.target.value })}
                    className="input-field"
                  >
                    {tierOptions.map((tier) => (
                      <option key={tier} value={tier}>
                        {tier.charAt(0).toUpperCase() + tier.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={companyForm.status}
                    onChange={(e) => setCompanyForm({ ...companyForm, status: e.target.value })}
                    className="input-field"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Contact Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      value={companyForm.contact_person}
                      onChange={(e) => setCompanyForm({ ...companyForm, contact_person: e.target.value })}
                      className="input-field"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={companyForm.contact_email}
                      onChange={(e) => setCompanyForm({ ...companyForm, contact_email: e.target.value })}
                      className="input-field"
                      placeholder="admin@company.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={companyForm.contact_phone}
                      onChange={(e) => setCompanyForm({ ...companyForm, contact_phone: e.target.value })}
                      className="input-field"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={companyForm.address}
                      onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                      className="input-field"
                      placeholder="123 Business Street, City"
                    />
                  </div>
                </div>
              </div>

              {!editingCompany && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Company Admin Login Credentials</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    These credentials will be used by the company admin to log in and manage their company.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Admin Full Name
                      </label>
                      <input
                        type="text"
                        value={companyForm.admin_name}
                        onChange={(e) => setCompanyForm({ ...companyForm, admin_name: e.target.value })}
                        className="input-field"
                        placeholder="Jane Smith"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Admin Email
                      </label>
                      <input
                        type="email"
                        value={companyForm.admin_email}
                        onChange={(e) => setCompanyForm({ ...companyForm, admin_email: e.target.value })}
                        className="input-field"
                        placeholder="admin@company.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Admin Password
                    </label>
                    <input
                      type="password"
                      value={companyForm.admin_password}
                      onChange={(e) => setCompanyForm({ ...companyForm, admin_password: e.target.value })}
                      className="input-field"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-6">
                <button type="submit" className="btn-primary flex-1" disabled={deletingId}>
                  {editingCompany ? 'Update Company' : 'Create Company'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}