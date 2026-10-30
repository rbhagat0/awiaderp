import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Plus, Trash2, Edit3, Building2, ShieldAlert, X } from 'lucide-react';

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
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="glass-panel p-8 md:p-12 max-w-md w-full text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-500/10 rounded-full blur-[40px] pointer-events-none" />
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl mb-6">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-premium-text mb-2 tracking-tight">Access Denied</h1>
          <p className="text-sm text-premium-textMuted font-medium">Master Admin access is required to view this page.</p>
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
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-[80px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-premium-accent/5 rounded-full blur-[80px] pointer-events-none -z-10" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 glass-card p-6 md:p-8">
        <div>
          <div className="inline-flex items-center justify-center p-2.5 bg-brand/10 text-brand rounded-xl mb-4 border border-brand/20">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-premium-text tracking-tight mb-1">Master Admin</h1>
          <p className="text-sm text-premium-textMuted font-medium">
            Manage onboarded tenant companies and subscriptions
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary flex items-center justify-center gap-2 md:w-auto shadow-brand/20 shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add Company
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in slide-in-from-top-2 ${
          messageType === 'success'
            ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
            : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
        }`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}

      {loading ? (
         <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-premium-border border-t-brand rounded-full animate-spin" />
            <p className="text-sm font-medium text-premium-textMuted animate-pulse">Loading tenants...</p>
          </div>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          {/* Mobile responsive scrolling container */}
          <div className="w-full overflow-x-auto custom-scrollbar relative">
            <table className="premium-table min-w-[700px]">
              <thead>
                <tr>
                  <th className="pl-6 md:pl-8">Company Name</th>
                  <th>Tier</th>
                  <th>Status</th>
                  {/* Sticky right column for actions so they never scroll off screen */}
                  <th className="text-right sticky right-0 bg-premium-card/95 backdrop-blur-md shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.1)] pr-6 md:pr-8 z-10 w-[120px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-premium-border/50">
                {companies.map((company) => (
                  <tr key={company.id} className="group hover:bg-premium-bg/50 transition-colors">
                    <td className="pl-6 md:pl-8 font-semibold text-premium-text whitespace-nowrap">
                      {company.name}
                    </td>
                    <td>
                      <select
                        value={company.subscription_tier}
                        onChange={(e) => handleUpdateCompany(company.id, e.target.value, company.status)}
                        className="select-field text-xs font-semibold py-2 px-3 bg-transparent border-transparent hover:border-premium-border focus:border-brand w-auto min-w-[130px]"
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
                        className={`select-field text-xs font-bold py-2 px-3 border-transparent hover:border-premium-border focus:border-brand w-auto min-w-[120px] ${
                          company.status === 'active' ? 'text-green-500 bg-green-500/5' : 
                          company.status === 'suspended' ? 'text-red-500 bg-red-500/5' : 
                          'text-yellow-500 bg-yellow-500/5'
                        }`}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="text-right sticky right-0 bg-premium-card/95 backdrop-blur-md shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.1)] pr-6 md:pr-8 group-hover:bg-premium-bg/95 z-10">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => openEditModal(company)}
                          className="p-2 text-premium-textMuted hover:text-brand hover:bg-brand/10 rounded-lg transition-all"
                          title="Edit Company"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCompany(company.id)}
                          className="p-2 text-premium-textMuted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
                          title="Delete Company"
                          disabled={deletingId === company.id}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {companies.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-12 text-premium-textMuted font-medium">
                      No companies found. Add one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enhanced Glassmorphism Modal */}
      {showModal && (
        <div className="modal-overlay animate-in fade-in duration-200">
          <div className="glass-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200 shadow-2xl">
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-premium-border/50 sticky top-0 bg-premium-card/90 backdrop-blur-xl z-20">
              <h2 className="text-xl font-bold text-premium-text tracking-tight">
                {editingCompany ? 'Edit Company Profile' : 'Register New Tenant'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-premium-textMuted hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCompany} className="p-6 md:p-8 space-y-8">
              {/* Basic Info */}
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-2 ml-1">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={companyForm.name}
                    onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                    className="input-field py-3"
                    placeholder="e.g. Acme Corporation"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-2 ml-1">
                      Subscription Tier
                    </label>
                    <select
                      value={companyForm.subscription_tier}
                      onChange={(e) => setCompanyForm({ ...companyForm, subscription_tier: e.target.value })}
                      className="select-field py-3"
                    >
                      {tierOptions.map((tier) => (
                        <option key={tier} value={tier}>
                          {tier.charAt(0).toUpperCase() + tier.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-2 ml-1">
                      Account Status
                    </label>
                    <select
                      value={companyForm.status}
                      onChange={(e) => setCompanyForm({ ...companyForm, status: e.target.value })}
                      className="select-field py-3"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="pt-6 border-t border-premium-border/50">
                <h3 className="text-sm font-bold text-premium-text mb-6">Contact Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-2 ml-1">
                      Primary Contact
                    </label>
                    <input
                      type="text"
                      value={companyForm.contact_person}
                      onChange={(e) => setCompanyForm({ ...companyForm, contact_person: e.target.value })}
                      className="input-field py-3"
                      placeholder="Jane Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-2 ml-1">
                      Business Email
                    </label>
                    <input
                      type="email"
                      value={companyForm.contact_email}
                      onChange={(e) => setCompanyForm({ ...companyForm, contact_email: e.target.value })}
                      className="input-field py-3"
                      placeholder="admin@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-2 ml-1">
                      Support Phone
                    </label>
                    <input
                      type="tel"
                      value={companyForm.contact_phone}
                      onChange={(e) => setCompanyForm({ ...companyForm, contact_phone: e.target.value })}
                      className="input-field py-3"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-2 ml-1">
                      Headquarters
                    </label>
                    <input
                      type="text"
                      value={companyForm.address}
                      onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                      className="input-field py-3"
                      placeholder="123 Business Blvd, Tech City"
                    />
                  </div>
                </div>
              </div>

              {/* Admin Credentials (Create Only) */}
              {!editingCompany && (
                <div className="pt-6 border-t border-premium-border/50">
                  <div className="mb-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                    <h3 className="text-sm font-bold text-blue-500 dark:text-blue-400 mb-1">Initial Admin Setup</h3>
                    <p className="text-xs font-medium text-premium-textMuted">
                      These credentials will be securely provisioned to the company's first administrator.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-2 ml-1">
                        Admin Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={companyForm.admin_name}
                        onChange={(e) => setCompanyForm({ ...companyForm, admin_name: e.target.value })}
                        className="input-field py-3"
                        placeholder="Jane Smith"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-2 ml-1">
                        Admin Login Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={companyForm.admin_email}
                        onChange={(e) => setCompanyForm({ ...companyForm, admin_email: e.target.value })}
                        className="input-field py-3"
                        placeholder="admin@company.com"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-2 ml-1">
                        Temporary Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={companyForm.admin_password}
                        onChange={(e) => setCompanyForm({ ...companyForm, admin_password: e.target.value })}
                        className="input-field py-3"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-8 border-t border-premium-border/50">
                <button type="submit" className="btn-primary sm:flex-1 py-3.5 shadow-brand/20 shadow-lg" disabled={deletingId}>
                  {editingCompany ? 'Save Changes' : 'Provision Tenant'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary sm:flex-1 py-3.5 hover:bg-premium-border/20"
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