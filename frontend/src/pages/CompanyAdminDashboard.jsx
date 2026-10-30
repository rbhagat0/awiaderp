import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { LayoutGrid, User, Mail, Phone, MapPin, Building2, ShieldAlert, Settings, Edit3, X } from 'lucide-react';

export default function CompanyAdminDashboard() {
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    address: '',
  });
  const [showDetails, setShowDetails] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.role === 'company_admin') {
      fetchCompany();
    }
  }, [user]);

  if (user?.role !== 'company_admin') {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="glass-panel p-8 md:p-12 max-w-md w-full text-center relative overflow-hidden">
          {/* Subtle background glow for the error state */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-500/10 rounded-full blur-[40px] pointer-events-none" />
          
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl mb-6">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-premium-text mb-2 tracking-tight">Access Denied</h1>
          <p className="text-sm text-premium-textMuted font-medium">Company Admin access is required to view this page.</p>
        </div>
      </div>
    );
  }

  const fetchCompany = async () => {
    try {
      const response = await api.get(`/companies/${user.company_id}`);
      setCompany(response.data);
      setDetails({
        contact_person: response.data.contact_person || '',
        contact_email: response.data.contact_email || '',
        contact_phone: response.data.contact_phone || '',
        address: response.data.address || '',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    try {
      const response = await api.patch('/companies/details', details);
      setCompany(response.data);
      setShowDetails(false);
      setMessage('Company details updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to update details');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {/* Decorative background gradients for the glass effect to interact with */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-[80px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-premium-accent/5 rounded-full blur-[80px] pointer-events-none -z-10" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 glass-card p-6 md:p-8">
        <div>
          <div className="inline-flex items-center justify-center p-2.5 bg-brand/10 text-brand rounded-xl mb-4 border border-brand/20">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-premium-text tracking-tight mb-1">Company Dashboard</h1>
          <p className="text-sm text-premium-textMuted font-medium">
            Manage your workspace settings and organization profile
          </p>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="btn-primary flex items-center justify-center gap-2 md:w-auto shadow-brand/20 shadow-lg"
        >
          {showDetails ? (
            <><X className="w-4 h-4" /> Close Editor</>
          ) : (
            <><Edit3 className="w-4 h-4" /> Edit Profile</>
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-premium-border border-t-brand rounded-full animate-spin" />
            <p className="text-sm font-medium text-premium-textMuted animate-pulse">Loading workspace data...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Notifications */}
          {message && (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 animate-in slide-in-from-top-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-sm font-medium text-green-600 dark:text-green-400">{message}</p>
            </div>
          )}

          {/* Edit Form Modal/Drawer */}
          {showDetails && (
            <div className="glass-panel p-6 md:p-8 animate-in slide-in-from-top-4 fade-in">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-5 h-5 text-premium-textMuted" />
                <h2 className="text-xl font-bold text-premium-text">Edit Company Details</h2>
              </div>
              <form onSubmit={handleUpdateDetails} className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-2 ml-1">
                      Primary Contact
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-premium-textMuted group-focus-within:text-brand transition-colors" />
                      <input
                        type="text"
                        value={details.contact_person}
                        onChange={(e) => setDetails({ ...details, contact_person: e.target.value })}
                        className="input-field pl-11 py-3"
                        placeholder="e.g. Jane Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-2 ml-1">
                      Business Email
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-premium-textMuted group-focus-within:text-brand transition-colors" />
                      <input
                        type="email"
                        value={details.contact_email}
                        onChange={(e) => setDetails({ ...details, contact_email: e.target.value })}
                        className="input-field pl-11 py-3"
                        placeholder="admin@company.com"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-2 ml-1">
                      Support Phone
                    </label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-premium-textMuted group-focus-within:text-brand transition-colors" />
                      <input
                        type="tel"
                        value={details.contact_phone}
                        onChange={(e) => setDetails({ ...details, contact_phone: e.target.value })}
                        className="input-field pl-11 py-3"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-2 ml-1">
                      Headquarters Address
                    </label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-premium-textMuted group-focus-within:text-brand transition-colors" />
                      <input
                        type="text"
                        value={details.address}
                        onChange={(e) => setDetails({ ...details, address: e.target.value })}
                        className="input-field pl-11 py-3"
                        placeholder="123 Business Blvd, Tech City"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-premium-border/50">
                  <button type="submit" className="btn-primary sm:flex-1 py-3 font-semibold shadow-lg shadow-brand/20">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDetails(false)}
                    className="btn-secondary sm:flex-1 py-3 font-semibold hover:bg-premium-border/20"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 flex flex-col justify-between group hover:border-brand/30 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-brand/10 text-brand rounded-xl border border-brand/20 group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1">Organization</p>
                <h3 className="text-xl font-bold text-premium-text tracking-tight truncate" title={company?.name}>{company?.name || '—'}</h3>
              </div>
            </div>

            <div className="glass-card p-6 flex flex-col justify-between group hover:border-brand/30 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-brand/10 text-brand rounded-xl border border-brand/20 group-hover:scale-110 transition-transform">
                  <LayoutGrid className="w-6 h-6" />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1">Current Plan</p>
                <h3 className="text-xl font-bold text-premium-text tracking-tight capitalize">
                  {company?.subscription_tier || '—'}
                </h3>
              </div>
            </div>

            <div className="glass-card p-6 flex flex-col justify-between group hover:border-brand/30 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-brand/10 text-brand rounded-xl border border-brand/20 group-hover:scale-110 transition-transform">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${
                  company?.status === 'active'
                    ? 'bg-green-500/10 text-green-500 border-green-500/20'
                    : company?.status === 'suspended'
                    ? 'bg-red-500/10 text-red-500 border-red-500/20'
                    : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                }`}>
                  {company?.status || 'Unknown'}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1">Account Status</p>
                <h3 className="text-xl font-bold text-premium-text tracking-tight capitalize">
                  {company?.status || '—'}
                </h3>
              </div>
            </div>
          </div>

          {/* Detailed Info Card */}
          <div className="glass-panel p-6 md:p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-premium-border/30 rounded-lg">
                <MapPin className="w-5 h-5 text-premium-textMuted" />
              </div>
              <h2 className="text-lg font-bold text-premium-text">Contact Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-premium-bg/30 border border-premium-border/30">
                  <User className="w-5 h-5 text-brand mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1">Contact Person</p>
                    <p className="text-sm font-medium text-premium-text">{details.contact_person || 'Not configured'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-premium-bg/30 border border-premium-border/30">
                  <Mail className="w-5 h-5 text-brand mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1">Contact Email</p>
                    <p className="text-sm font-medium text-premium-text">{details.contact_email || 'Not configured'}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-premium-bg/30 border border-premium-border/30">
                  <Phone className="w-5 h-5 text-brand mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1">Support Phone</p>
                    <p className="text-sm font-medium text-premium-text">{details.contact_phone || 'Not configured'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-premium-bg/30 border border-premium-border/30">
                  <MapPin className="w-5 h-5 text-brand mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1">Headquarters</p>
                    <p className="text-sm font-medium text-premium-text leading-relaxed max-w-[250px]">{details.address || 'Not configured'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}