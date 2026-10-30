import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Plus, Trash2, Edit3, Building2, ShieldAlert, X, Info } from 'lucide-react';

export default function MasterAdminPage() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [companyForm, setCompanyForm] = useState({
    name: '',
    company_code: '',
    gst_number: '',
    jurisdiction: '',
    subscription_tier: 'starter',
    status: 'active',
    subscription_period: '1_month',
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
  const [showTierInfo, setShowTierInfo] = useState(false);
  const [subscriptionPeriod, setSubscriptionPeriod] = useState('1_month');

  const TIER_PLANS = {
    starter: {
      name: 'Starter',
      price: '$29/month',
      maxUsers: 5,
      maxClients: 50,
      maxProjects: 10,
      maxTasks: 100,
      features: ['Basic dashboard', 'Client management', 'Project tracking', 'Email support'],
    },
    professional: {
      name: 'Professional',
      price: '$79/month',
      maxUsers: 25,
      maxClients: 200,
      maxProjects: 50,
      maxTasks: 500,
      features: ['Everything in Starter', 'Advanced reporting', 'API access', 'Priority email support', 'Custom domains'],
    },
    enterprise: {
      name: 'Enterprise',
      price: '$199/month',
      maxUsers: -1,
      maxClients: -1,
      maxProjects: -1,
      maxTasks: -1,
      features: ['Everything in Professional', 'Unlimited users/clients/projects/tasks', 'SSO / SAML integration', 'Dedicated account manager', '24/7 phone support', 'Custom SLA'],
    },
  };

  const periodOptions = [
    { value: '7_days', label: '7 Day Trial' },
    { value: '1_month', label: '1 Month' },
    { value: '3_months', label: '3 Months' },
    { value: '6_months', label: '6 Months' },
    { value: '1_year', label: '1 Year' },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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
      company_code: '',
      gst_number: '',
      jurisdiction: '',
      subscription_tier: 'starter',
      status: 'active',
      subscription_period: '1_month',
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
      company_code: company.company_code || '',
      gst_number: company.gst_number || '',
      jurisdiction: company.jurisdiction || '',
      subscription_tier: company.subscription_tier || 'starter',
      status: company.status || 'active',
      subscription_period: company.subscription_duration || '1_month',
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
          company_code: companyForm.company_code,
          gst_number: companyForm.gst_number,
          jurisdiction: companyForm.jurisdiction,
          subscription_tier: companyForm.subscription_tier,
          status: companyForm.status,
          subscription_duration: companyForm.subscription_period,
          contact_person: companyForm.contact_person,
          contact_email: companyForm.contact_email,
          contact_phone: companyForm.contact_phone,
          address: companyForm.address,
        });
        setMessage('Company updated successfully');
      } else {
        await api.post('/companies', {
          name: companyForm.name,
          company_code: companyForm.company_code,
          gst_number: companyForm.gst_number,
          jurisdiction: companyForm.jurisdiction,
          subscription_tier: companyForm.subscription_tier,
          status: companyForm.status,
          subscription_duration: companyForm.subscription_period,
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

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Lakshadweep', 'Puducherry',
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative mt-2">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-[80px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-premium-accent/5 rounded-full blur-[80px] pointer-events-none -z-10" />

      {/* Header Section */}
      <div className="flex flex-row items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center p-2 bg-brand/10 text-brand rounded-xl border border-brand/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-premium-text tracking-tight">Master Admin</h1>
            <p className="text-xs text-premium-textMuted font-medium">
              Manage onboarded tenant companies and subscriptions
            </p>
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary p-2.5 shadow-brand/20 shadow-lg"
          title="Add new tenant"
        >
          <Plus className="w-4 h-4" />
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
                  <th className="flex items-center gap-2">
  Tier
  <button
    onClick={() => setShowTierInfo(!showTierInfo)}
    className="p-1 text-premium-textMuted hover:text-brand hover:bg-brand/10 rounded-lg transition-all"
    title="View subscription tier differences"
  >
    <Info className="w-3 h-3" />
  </button>
</th>
                  <th>Status</th>
                  <th>Subscription Expiry</th>
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
                    <td className="text-sm text-premium-textMuted font-medium">
                      {formatDate(company.subscription_end_date)}
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

      {/* Enhanced Glassmorphism Modal - Compact Version */}
      {showModal && (
        <div className="modal-overlay animate-in fade-in duration-200">
          <div className="glass-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200 shadow-2xl">
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-premium-border/50 sticky top-0 bg-premium-card/90 backdrop-blur-xl z-20">
              <h2 className="text-lg font-bold text-premium-text tracking-tight">
                {editingCompany ? 'Edit Company Profile' : 'Register New Tenant'}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 text-premium-textMuted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCompany} className="p-5 md:p-6 space-y-6">
              
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1.5 ml-1">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      className="input-field py-2.5"
                      placeholder="e.g. Acme Corporation"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1.5 ml-1">
                      Company Code
                    </label>
                    <input
                      type="text"
                      value={companyForm.company_code}
                      onChange={(e) => setCompanyForm({ ...companyForm, company_code: e.target.value })}
                      className="input-field py-2.5"
                      placeholder="e.g. ACME001"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1.5 ml-1">
                      GST Number
                    </label>
                    <input
                      type="text"
                      value={companyForm.gst_number}
                      onChange={(e) => setCompanyForm({ ...companyForm, gst_number: e.target.value })}
                      className="input-field py-2.5"
                      placeholder="e.g. 22AAAAA0000A1Z5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1.5 ml-1">
                      Jurisdiction (State)
                    </label>
                    <select
                      value={companyForm.jurisdiction}
                      onChange={(e) => setCompanyForm({ ...companyForm, jurisdiction: e.target.value })}
                      className="select-field py-2.5"
                    >
                      <option value="">Select State</option>
                      {indianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1.5 ml-1">
                      Subscription Tier
                    </label>
                    <select
                      value={companyForm.subscription_tier}
                      onChange={(e) => setCompanyForm({ ...companyForm, subscription_tier: e.target.value })}
                      className="select-field py-2.5"
                    >
                      {tierOptions.map((tier) => (
                        <option key={tier} value={tier}>
                          {tier.charAt(0).toUpperCase() + tier.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1.5 ml-1">
                      Account Status
                    </label>
                    <select
                      value={companyForm.status}
                      onChange={(e) => setCompanyForm({ ...companyForm, status: e.target.value })}
                      className="select-field py-2.5"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1.5 ml-1">
                      Subscription Period
                    </label>
                    <select
                      value={companyForm.subscription_period}
                      onChange={(e) => setCompanyForm({ ...companyForm, subscription_period: e.target.value })}
                      className="select-field py-2.5"
                    >
                      {periodOptions.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="pt-5 border-t border-premium-border/50">
                <h3 className="text-xs font-bold text-premium-text mb-4 uppercase tracking-wider">Contact Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1.5 ml-1">
                      Primary Contact
                    </label>
                    <input
                      type="text"
                      value={companyForm.contact_person}
                      onChange={(e) => setCompanyForm({ ...companyForm, contact_person: e.target.value })}
                      className="input-field py-2.5"
                      placeholder="Jane Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1.5 ml-1">
                      Business Email
                    </label>
                    <input
                      type="email"
                      value={companyForm.contact_email}
                      onChange={(e) => setCompanyForm({ ...companyForm, contact_email: e.target.value })}
                      className="input-field py-2.5"
                      placeholder="admin@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1.5 ml-1">
                      Support Phone
                    </label>
                    <input
                      type="tel"
                      value={companyForm.contact_phone}
                      onChange={(e) => setCompanyForm({ ...companyForm, contact_phone: e.target.value })}
                      className="input-field py-2.5"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1.5 ml-1">
                      Headquarters
                    </label>
                    <input
                      type="text"
                      value={companyForm.address}
                      onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                      className="input-field py-2.5"
                      placeholder="123 Business Blvd, Tech City"
                    />
                  </div>
                </div>
              </div>

              {/* Admin Credentials (Create Only) */}
              {!editingCompany && (
                <div className="pt-5 border-t border-premium-border/50">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="text-xs font-bold text-premium-text uppercase tracking-wider">Admin Credentials</h3>
                     <span className="text-[10px] font-medium text-brand bg-brand/10 px-2 py-0.5 rounded-full border border-brand/20">Initial Setup</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1.5 ml-1">
                        Admin Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={companyForm.admin_name}
                        onChange={(e) => setCompanyForm({ ...companyForm, admin_name: e.target.value })}
                        className="input-field py-2.5"
                        placeholder="Jane Smith"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1.5 ml-1">
                        Admin Login Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={companyForm.admin_email}
                        onChange={(e) => setCompanyForm({ ...companyForm, admin_email: e.target.value })}
                        className="input-field py-2.5"
                        placeholder="admin@company.com"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1.5 ml-1">
                        Temporary Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={companyForm.admin_password}
                        onChange={(e) => setCompanyForm({ ...companyForm, admin_password: e.target.value })}
                        className="input-field py-2.5"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-premium-border/50">
                 <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary py-2.5 px-6 hover:bg-premium-border/20 text-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary py-2.5 px-6 shadow-brand/20 shadow-lg text-sm" disabled={deletingId}>
                  {editingCompany ? 'Save Changes' : 'Provision Tenant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tier Info Popup */}
      {showTierInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowTierInfo(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="glass-modal w-full max-w-2xl p-6 relative z-10 animate-in zoom-in-95 duration-200 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-premium-text">Subscription Tier Comparison</h2>
              <button
                onClick={() => setShowTierInfo(false)}
                className="p-2 text-premium-textMuted hover:text-red-500 hover:bg-red-500/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-premium-border/50">
                <thead>
                  <tr className="bg-premium-bg/30">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-premium-textMuted uppercase">Feature</th>
                    {Object.entries(TIER_PLANS).map(([key, plan]) => (
                      <th key={key} className="px-4 py-3 text-left text-xs font-semibold text-premium-text uppercase">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-premium-border/50">
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-premium-text">Price</td>
                    {Object.entries(TIER_PLANS).map(([key, plan]) => (
                      <td key={key} className="px-4 py-3 text-sm text-premium-textMuted font-medium">{plan.price}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-premium-text">Max Users</td>
                    {Object.entries(TIER_PLANS).map(([key, plan]) => (
                      <td key={key} className="px-4 py-3 text-sm text-premium-textMuted">
                        {plan.maxUsers === -1 ? 'Unlimited' : plan.maxUsers}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-premium-text">Max Clients</td>
                    {Object.entries(TIER_PLANS).map(([key, plan]) => (
                      <td key={key} className="px-4 py-3 text-sm text-premium-textMuted">
                        {plan.maxClients === -1 ? 'Unlimited' : plan.maxClients}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-premium-text">Max Projects</td>
                    {Object.entries(TIER_PLANS).map(([key, plan]) => (
                      <td key={key} className="px-4 py-3 text-sm text-premium-textMuted">
                        {plan.maxProjects === -1 ? 'Unlimited' : plan.maxProjects}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-premium-text">Max Tasks</td>
                    {Object.entries(TIER_PLANS).map(([key, plan]) => (
                      <td key={key} className="px-4 py-3 text-sm text-premium-textMuted">
                        {plan.maxTasks === -1 ? 'Unlimited' : plan.maxTasks}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-premium-text">Features</td>
                    {Object.entries(TIER_PLANS).map(([key, plan]) => (
                      <td key={key} className="px-4 py-3 text-sm text-premium-textMuted">
                        <ul className="list-disc list-inside space-y-1 text-xs">
                          {plan.features.map((feature, idx) => (
                            <li key={idx}>{feature}</li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}