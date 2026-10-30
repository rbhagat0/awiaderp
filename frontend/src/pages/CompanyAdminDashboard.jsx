import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { 
  LayoutGrid, User, Mail, Phone, MapPin, Building2, ShieldAlert, 
  Settings, Edit3, X, Users, CreditCard, Factory, Globe, 
  DollarSign, Calendar, Lock, Key, ShieldCheck
} from 'lucide-react';

export default function CompanyAdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    industry: '',
    gst_number: '',
    currency: 'USD',
    timezone: 'UTC',
    financial_year: 'Jan-Dec'
  });
  const [showDetails, setShowDetails] = useState(false);
  const [message, setMessage] = useState('');const [pendingResets, setPendingResets] = useState([]);
const [showResetModal, setShowResetModal] = useState(false);
const [selectedReset, setSelectedReset] = useState(null);
const [error, setError] = useState('');
  // Mock data for features not yet in the backend
  const mockFacilities = [
    { id: 1, name: 'Global Headquarters', type: 'Office', address: 'Tech City, CA', isPrimary: true },
    { id: 2, name: 'Plant Alpha', type: 'Manufacturing', address: 'Industrial Park, NV', isPrimary: false },
    { id: 3, name: 'Logistics Hub 1', type: 'Warehouse', address: 'Port City, WA', isPrimary: false },
  ];
  
  const activeUsers = 12;
  const totalSeats = company?.subscription_tier === 'enterprise' ? 'Unlimited' : (company?.subscription_tier === 'professional' ? 50 : 10);
  const usagePercentage = totalSeats === 'Unlimited' ? 0 : (activeUsers / totalSeats) * 100;

  useEffect(() => {
    if (user?.role === 'company_admin') {
      fetchCompany();
      fetchPendingResets();
    }
  }, [user]);

  if (user?.role !== 'company_admin') {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="glass-panel p-8 md:p-12 max-w-md w-full text-center relative overflow-hidden">
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
        industry: response.data.industry || 'Manufacturing',
        gst_number: response.data.gst_number || 'Not Configured',
        currency: response.data.currency || 'USD ($)',
        timezone: response.data.timezone || 'UTC (Standard)',
        financial_year: response.data.financial_year || 'Jan - Dec'
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingResets = async () => {
    try {
      const response = await api.get('/auth/pending-resets');
      setPendingResets(response.data);
    } catch (err) {
      console.error('Failed to fetch pending resets:', err);
    }
  };

  const handleApproveReset = async (resetId, action) => {
    try {
      const response = await api.post('/auth/approve-reset', { resetId, action });
      setMessage(response.data.message);
      setTimeout(() => setMessage(''), 3000);
      setSelectedReset(null);
      setShowResetModal(false);
      fetchPendingResets();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process request');
      setTimeout(() => setError(''), 3000);
    }
  };



  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    try {
      const response = await api.patch('/companies/details', details);
      setCompany(response.data);
      setShowDetails(false);
      setMessage('Workspace profile updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to update details');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative pb-10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-[80px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-premium-accent/5 rounded-full blur-[80px] pointer-events-none -z-10" />

      {/* Sleek Hero Header Section */}
      <div className="relative p-6 md:p-8 rounded-3xl border border-premium-border/60 bg-premium-card/40 backdrop-blur-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 group">
        
        {/* Ambient background lights specifically for this card */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-brand/20 to-cyan-400/10 rounded-full blur-[60px] pointer-events-none transition-opacity duration-700 opacity-60 group-hover:opacity-100" />
        <div className="absolute -bottom-24 -left-12 w-64 h-64 bg-gradient-to-tr from-brand/10 to-premium-accent/10 rounded-full blur-[60px] pointer-events-none opacity-50" />

        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand/10 to-brand/5 border border-brand/20 flex items-center justify-center shrink-0 shadow-inner">
            <Settings className="w-7 h-7 text-brand drop-shadow-[0_2px_10px_rgba(59,130,246,0.3)]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-premium-text tracking-tight mb-1">
              Workspace Settings
            </h1>
            <p className="text-sm font-medium text-premium-textMuted max-w-md leading-relaxed">
              Manage your organization profile, billing, facilities, and team access.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowDetails(true)}
          className="relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-premium-text bg-premium-bg/50 border border-premium-border/80 rounded-xl hover:border-brand/40 hover:bg-brand/5 hover:text-brand hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all duration-300 z-10 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Preferences</span>
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
          
          {message && (
            <div className="p-4 rounded-xl border flex items-center gap-3 animate-in slide-in-from-top-2 bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          {/* Top Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 flex flex-col justify-between group hover:border-brand/30 transition-colors relative overflow-hidden">
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="p-3 bg-brand/10 text-brand rounded-xl border border-brand/20 group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1">Organization ID: #{company?.id?.toString().padStart(4, '0')}</p>
                <h3 className="text-xl font-bold text-premium-text tracking-tight truncate" title={company?.name}>{company?.name || '—'}</h3>
              </div>
            </div>

            <div className="glass-card p-6 flex flex-col justify-between group hover:border-brand/30 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-brand/10 text-brand rounded-xl border border-brand/20 group-hover:scale-110 transition-transform">
                  <LayoutGrid className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border bg-brand/10 text-brand border-brand/20 capitalize">
                  {company?.subscription_tier || 'Starter'} Plan
                </span>
              </div>
              <div>
                <div className="flex justify-between items-end mb-2">
                  <p className="text-xs font-semibold text-premium-textMuted uppercase tracking-wider">Seat Usage</p>
                  <p className="text-sm font-bold text-premium-text">{activeUsers} / {totalSeats}</p>
                </div>
                {totalSeats !== 'Unlimited' && (
                  <div className="w-full bg-premium-border/50 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-1000 ${usagePercentage > 85 ? 'bg-red-500' : 'bg-brand'}`} 
                      style={{ width: `${usagePercentage}%` }} 
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="glass-card p-6 flex flex-col justify-between group hover:border-brand/30 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-brand/10 text-brand rounded-xl border border-brand/20 group-hover:scale-110 transition-transform">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${
                  company?.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                  company?.status === 'suspended' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                  'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                }`}>
                  {company?.status || 'Unknown'}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1">Billing Cycle</p>
                <h3 className="text-xl font-bold text-premium-text tracking-tight">Renews Oct 14, 2026</h3>
              </div>
            </div>
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column (Wider) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Identity & Legal Card */}
              <div className="glass-panel p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6 border-b border-premium-border/50 pb-4">
                  <div className="p-2 bg-premium-border/30 rounded-lg">
                    <Building2 className="w-5 h-5 text-premium-textMuted" />
                  </div>
                  <h2 className="text-lg font-bold text-premium-text">Identity & Legal</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-premium-bg/30 border border-premium-border/30">
                    <div className="p-2 rounded-xl bg-brand/5"><ShieldCheck className="w-5 h-5 text-brand" /></div>
                    <div>
                      <p className="text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1">Tax ID / GST</p>
                      <p className="text-sm font-bold text-premium-text font-mono">{details.gst_number}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-premium-bg/30 border border-premium-border/30">
                    <div className="p-2 rounded-xl bg-brand/5"><Factory className="w-5 h-5 text-brand" /></div>
                    <div>
                      <p className="text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1">Industry Sector</p>
                      <p className="text-sm font-bold text-premium-text">{details.industry}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-premium-bg/30 border border-premium-border/30">
                    <div className="p-2 rounded-xl bg-brand/5"><User className="w-5 h-5 text-brand" /></div>
                    <div>
                      <p className="text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1">Primary Contact</p>
                      <p className="text-sm font-medium text-premium-text">{details.contact_person || 'Not configured'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-premium-bg/30 border border-premium-border/30">
                    <div className="p-2 rounded-xl bg-brand/5"><Mail className="w-5 h-5 text-brand" /></div>
                    <div>
                      <p className="text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1">Billing Email</p>
                      <p className="text-sm font-medium text-premium-text truncate max-w-[180px]">{details.contact_email || 'Not configured'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Facilities & Locations Table */}
              <div className="glass-panel p-6 md:p-8">
                <div className="flex items-center justify-between mb-6 border-b border-premium-border/50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-premium-border/30 rounded-lg">
                      <MapPin className="w-5 h-5 text-premium-textMuted" />
                    </div>
                    <h2 className="text-lg font-bold text-premium-text">Facilities & Locations</h2>
                  </div>
                  <button className="text-xs font-bold text-brand hover:text-cyan-400 transition-colors uppercase tracking-wider">
                    + Add Facility
                  </button>
                </div>
                
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-premium-border/50">
                        <th className="pb-3 text-xs font-bold text-premium-textMuted uppercase tracking-wider">Facility Name</th>
                        <th className="pb-3 text-xs font-bold text-premium-textMuted uppercase tracking-wider">Type</th>
                        <th className="pb-3 text-xs font-bold text-premium-textMuted uppercase tracking-wider">Location</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-premium-border/30">
                      {mockFacilities.map(facility => (
                        <tr key={facility.id} className="group hover:bg-premium-bg/30 transition-colors">
                          <td className="py-4 text-sm font-bold text-premium-text flex items-center gap-2">
                            {facility.name}
                            {facility.isPrimary && <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-brand/10 text-brand">HQ</span>}
                          </td>
                          <td className="py-4 text-sm text-premium-textMuted">
                             <div className="flex items-center gap-2">
                               {facility.type === 'Manufacturing' ? <Factory className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                               {facility.type}
                             </div>
                          </td>
                          <td className="py-4 text-sm text-premium-textMuted">{facility.address}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column (Narrower) */}
            <div className="space-y-6">
              
              {/* Operational Preferences */}
              <div className="glass-panel p-6">
                <div className="flex items-center gap-3 mb-5 border-b border-premium-border/50 pb-3">
                  <Settings className="w-5 h-5 text-premium-textMuted" />
                  <h2 className="text-base font-bold text-premium-text">Operational Setup</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-premium-bg/30 border border-premium-border/30">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-4 h-4 text-premium-textMuted" />
                      <span className="text-sm font-medium text-premium-text">Base Currency</span>
                    </div>
                    <span className="text-xs font-bold text-premium-textMuted bg-premium-border/30 px-2 py-1 rounded">{details.currency}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-premium-bg/30 border border-premium-border/30">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-premium-textMuted" />
                      <span className="text-sm font-medium text-premium-text">Financial Year</span>
                    </div>
                    <span className="text-xs font-bold text-premium-textMuted bg-premium-border/30 px-2 py-1 rounded">{details.financial_year}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-premium-bg/30 border border-premium-border/30">
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-premium-textMuted" />
                      <span className="text-sm font-medium text-premium-text">Timezone</span>
                    </div>
                    <span className="text-xs font-bold text-premium-textMuted bg-premium-border/30 px-2 py-1 rounded">{details.timezone}</span>
                  </div>
                </div>
              </div>

              {/* Security & Access */}
              <div className="glass-panel p-6">
                <div className="flex items-center gap-3 mb-5 border-b border-premium-border/50 pb-3">
                  <Lock className="w-5 h-5 text-premium-textMuted" />
                  <h2 className="text-base font-bold text-premium-text">Security</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-premium-bg/30 border border-premium-border/30">
                    <div>
                      <p className="text-sm font-bold text-premium-text">Require 2FA</p>
                      <p className="text-[10px] text-premium-textMuted uppercase tracking-wider mt-0.5">For all employees</p>
                    </div>
                    {/* Mock Toggle Switch */}
                    <div className="w-10 h-6 bg-brand rounded-full relative cursor-pointer shadow-inner">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                    </div>
                  </div>
                  <button className="w-full flex items-center justify-between p-3 rounded-xl bg-premium-bg/30 border border-premium-border/30 hover:border-brand/30 transition-colors group">
                    <div className="flex items-center gap-3">
                      <Key className="w-4 h-4 text-premium-textMuted group-hover:text-brand" />
                      <span className="text-sm font-medium text-premium-text">API Keys & Webhooks</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="glass-panel p-6">
                <div className="flex items-center gap-3 mb-5 border-b border-premium-border/50 pb-3">
                  <LayoutGrid className="w-5 h-5 text-premium-textMuted" />
                  <h2 className="text-base font-bold text-premium-text">Shortcuts</h2>
                </div>
                <div className="space-y-3">
                  <button 
                    onClick={() => navigate('/employees')}
                    className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-premium-bg/50 border border-premium-border hover:border-brand/30 hover:bg-brand/5 transition-all group"
                  >
                    <Users className="w-5 h-5 text-premium-textMuted group-hover:text-brand transition-colors" />
                    <span className="font-bold text-sm text-premium-text">Manage Team Directory</span>
                  </button>
                  <button 
                    className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-premium-bg/50 border border-premium-border hover:border-brand/30 hover:bg-brand/5 transition-all group"
                  >
                    <CreditCard className="w-5 h-5 text-premium-textMuted group-hover:text-brand transition-colors" />
                    <span className="font-bold text-sm text-premium-text">Billing & Subscriptions</span>
                  </button>
                </div>
              </div>

              {/* Pending Password Resets */}
              <div className="glass-panel p-6">
                <div className="flex items-center gap-3 mb-5 border-b border-premium-border/50 pb-3">
                  <Lock className="w-5 h-5 text-premium-textMuted" />
                  <h2 className="text-base font-bold text-premium-text">Pending Resets</h2>
                </div>
                {pendingResets.length === 0 ? (
                  <p className="text-sm text-premium-textMuted text-center py-4">No pending password reset requests</p>
                ) : (
                  <div className="space-y-3">
                    {pendingResets.map(reset => (
                      <div key={reset.id} className="p-3 rounded-xl bg-premium-bg/30 border border-premium-border/30">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-sm font-bold text-premium-text">{reset.user_name || reset.email}</p>
                            <p className="text-xs text-premium-textMuted">{reset.email}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                            Pending
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setSelectedReset(reset); setShowResetModal(true); }}
                            className="flex-1 py-2 px-3 rounded-lg bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20 text-xs font-bold transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleApproveReset(reset.id, 'reject')}
                            className="flex-1 py-2 px-3 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 text-xs font-bold transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Edit Preferences Modal */}
          {showDetails && (
            <div className="modal-overlay animate-in fade-in duration-200 z-50">
              <div className="glass-modal w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200 shadow-2xl">
                <div className="flex items-center justify-between p-5 md:p-6 border-b border-premium-border/50 sticky top-0 bg-premium-card/90 backdrop-blur-xl z-20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand/10 text-brand rounded-lg">
                      <Settings className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-bold text-premium-text tracking-tight">Edit Workspace Preferences</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDetails(false)}
                    className="p-1.5 text-premium-textMuted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleUpdateDetails} className="p-5 md:p-6 space-y-8">
                  
                  {/* Business Identity */}
                  <div>
                    <h3 className="text-xs font-bold text-premium-text mb-4 uppercase tracking-wider text-brand">Business Identity</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1.5 ml-1">Tax ID / GST Number</label>
                        <input type="text" value={details.gst_number} onChange={(e) => setDetails({ ...details, gst_number: e.target.value })} className="input-field py-2.5" placeholder="e.g. 22AAAAA0000A1Z5" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1.5 ml-1">Industry Sector</label>
                        <select value={details.industry} onChange={(e) => setDetails({ ...details, industry: e.target.value })} className="select-field py-2.5">
                          <option value="Manufacturing">Manufacturing</option>
                          <option value="Textiles">Textiles & Apparel</option>
                          <option value="Automotive">Automotive Parts</option>
                          <option value="Electronics">Electronics Assembly</option>
                          <option value="Food & Beverage">Food & Beverage Processing</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Primary Contact */}
                  <div className="pt-6 border-t border-premium-border/50">
                     <h3 className="text-xs font-bold text-premium-text mb-4 uppercase tracking-wider text-brand">Billing Contact</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1.5 ml-1">Primary Contact</label>
                        <input type="text" value={details.contact_person} onChange={(e) => setDetails({ ...details, contact_person: e.target.value })} className="input-field py-2.5" placeholder="e.g. Jane Doe" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1.5 ml-1">Business Email</label>
                        <input type="email" value={details.contact_email} onChange={(e) => setDetails({ ...details, contact_email: e.target.value })} className="input-field py-2.5" placeholder="admin@company.com" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1.5 ml-1">Support Phone</label>
                        <input type="tel" value={details.contact_phone} onChange={(e) => setDetails({ ...details, contact_phone: e.target.value })} className="input-field py-2.5" placeholder="+1 234 567 8900" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1.5 ml-1">Registered Address</label>
                        <input type="text" value={details.address} onChange={(e) => setDetails({ ...details, address: e.target.value })} className="input-field py-2.5" placeholder="123 Business Blvd, Tech City" />
                      </div>
                    </div>
                  </div>

                  {/* Operational Settings */}
                  <div className="pt-6 border-t border-premium-border/50">
                     <h3 className="text-xs font-bold text-premium-text mb-4 uppercase tracking-wider text-brand">Operational Settings</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1.5 ml-1">Base Currency</label>
                        <select value={details.currency} onChange={(e) => setDetails({ ...details, currency: e.target.value })} className="select-field py-2.5">
                          <option value="USD ($)">USD ($)</option>
                          <option value="EUR (€)">EUR (€)</option>
                          <option value="INR (₹)">INR (₹)</option>
                          <option value="GBP (£)">GBP (£)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1.5 ml-1">Timezone</label>
                        <select value={details.timezone} onChange={(e) => setDetails({ ...details, timezone: e.target.value })} className="select-field py-2.5">
                          <option value="UTC (Standard)">UTC (Standard)</option>
                          <option value="EST (US East)">EST (US East)</option>
                          <option value="IST (India)">IST (India)</option>
                          <option value="CET (Europe)">CET (Europe)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1.5 ml-1">Financial Year</label>
                        <select value={details.financial_year} onChange={(e) => setDetails({ ...details, financial_year: e.target.value })} className="select-field py-2.5">
                          <option value="Jan - Dec">January - December</option>
                          <option value="Apr - Mar">April - March</option>
                          <option value="Jul - Jun">July - June</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-premium-border/50">
                    <button type="button" onClick={() => setShowDetails(false)} className="btn-secondary py-2.5 px-6 hover:bg-premium-border/20 text-sm">Cancel</button>
                    <button type="submit" className="btn-primary py-2.5 px-6 shadow-brand/20 shadow-lg text-sm">Save Preferences</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Reset Approval Modal */}
          {showResetModal && selectedReset && (
            <div className="modal-overlay animate-in fade-in duration-200 z-50">
              <div className="glass-modal w-full max-w-md max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 shadow-2xl">
                <div className="flex items-center justify-between p-5 md:p-6 border-b border-premium-border/50 sticky top-0 bg-premium-card/90 backdrop-blur-xl z-20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg">
                      <Lock className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-bold text-premium-text tracking-tight">Approve Password Reset</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="p-1.5 text-premium-textMuted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-5 md:p-6 space-y-6">
                  <div>
                    <p className="text-sm font-bold text-premium-text mb-1">Employee</p>
                    <p className="text-sm text-premium-textMuted">{selectedReset.user_name || selectedReset.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-premium-text mb-1">Email</p>
                    <p className="text-sm text-premium-textMuted font-mono">{selectedReset.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-premium-text mb-1">Requested</p>
                    <p className="text-sm text-premium-textMuted">{new Date(selectedReset.created_at).toLocaleDateString()}</p>
                  </div>

                  <div className="pt-4 border-t border-premium-border/50">
                    <p className="text-xs font-bold text-premium-textMuted uppercase tracking-wider mb-3">Action</p>
                    <div className="space-y-3">
                      <button
                        onClick={() => handleApproveReset(selectedReset.id, 'approve')}
                        className="w-full py-3 px-4 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20 font-bold text-sm transition-colors"
                      >
                        ✓ Approve Reset Request
                      </button>
                      <button
                        onClick={() => handleApproveReset(selectedReset.id, 'reject')}
                        className="w-full py-3 px-4 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 font-bold text-sm transition-colors"
                      >
                        ✗ Reject Reset Request
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}