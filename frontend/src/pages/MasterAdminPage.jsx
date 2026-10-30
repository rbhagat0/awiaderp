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
      <div className="min-h-screen flex items-center justify-center bg-premium-dark">
        <div className="glass-panel p-8 md:p-12 max-w-md w-full">
          <h1 className="section-title">Access Denied</h1>
          <p className="section-subtitle mt-2">Super Admin access required.</p>
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
          <h1 className="section-title">Master Admin</h1>
          <p className="section-subtitle">
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
        <div className={`p-4 rounded-xl text-sm border ${
          messageType === 'success'
            ? 'bg-premium-success/10 text-premium-success border-premium-success/20'
            : 'bg-premium-error/10 text-premium-error border-premium-error/20'
        }`}>
          {message}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-premium-textMuted">
          Loading companies...
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Tier</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id}>
                  <td className="font-medium">{company.name}</td>
                  <td>
                    <select
                      value={company.subscription_tier}
                      onChange={(e) => handleUpdateCompany(company.id, e.target.value, company.status)}
                      className="select-field text-sm"
                    >
                      {tierOptions.map((tier) => (
                        <option key={tier} value={tier}>
                          {tier.charAt(0).toUpperCase() + tier.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={company.status}
                      onChange={(e) => handleUpdateCompany(company.id, company.subscription_tier, e.target.value)}
                      className="select-field text-sm"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <span className={`badge ${
                      company.status === 'active'
                        ? 'badge-active'
                        : company.status === 'suspended'
                        ? 'badge-suspended'
                        : 'badge-trial'
                    }`}>
                      {company.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => openEditModal(company)}
                        className="p-2.5 text-premium-accent hover:bg-premium-accent/10 rounded-xl transition-all"
                        title="Edit Company"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCompany(company.id)}
                        className="p-2.5 text-premium-error hover:bg-premium-error/10 rounded-xl transition-all"
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
        <div className="modal-overlay">
          <div className="glass-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-premium-text">
                {editingCompany ? 'Edit Company' : 'Add New Company'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2.5 text-premium-textMuted hover:bg-[var(--premium-card)]/30 rounded-xl transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCompany} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-premium-textMuted mb-2">
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
                  <label className="block text-sm font-medium text-premium-textMuted mb-2">
                    Subscription Tier
                  </label>
                  <select
                    value={companyForm.subscription_tier}
                    onChange={(e) => setCompanyForm({ ...companyForm, subscription_tier: e.target.value })}
                    className="select-field"
                  >
                    {tierOptions.map((tier) => (
                      <option key={tier} value={tier}>
                        {tier.charAt(0).toUpperCase() + tier.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-premium-textMuted mb-2">
                    Status
                  </label>
                  <select
                    value={companyForm.status}
                    onChange={(e) => setCompanyForm({ ...companyForm, status: e.target.value })}
                    className="select-field"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-5 border-t border-premium-border">
                <h3 className="text-sm font-semibold text-premium-text mb-3">Contact Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-premium-textMuted mb-2">
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
                    <label className="block text-sm font-medium text-premium-textMuted mb-2">
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
                    <label className="block text-sm font-medium text-premium-textMuted mb-2">
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
                    <label className="block text-sm font-medium text-premium-textMuted mb-2">
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
                <div className="pt-5 border-t border-premium-border">
                  <h3 className="text-sm font-semibold text-premium-text mb-3">Company Admin Login Credentials</h3>
                  <p className="text-sm text-premium-textMuted mb-4">
                    These credentials will be used by the company admin to log in and manage their company.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-premium-textMuted mb-2">
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
                      <label className="block text-sm font-medium text-premium-textMuted mb-2">
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
                    <label className="block text-sm font-medium text-premium-textMuted mb-2">
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