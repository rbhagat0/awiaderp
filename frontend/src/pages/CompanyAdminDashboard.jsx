import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { LayoutGrid, User, Mail, Phone, MapPin, Building2 } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Company Admin access required.</p>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Company Admin</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage {company?.name || 'your company'} details and employees
          </p>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="btn-primary flex items-center gap-2"
        >
          <Building2 className="w-4 h-4" />
          {showDetails ? 'Hide Details' : 'Company Details'}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          Loading company details...
        </div>
      ) : (
        <>
        {message && (
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm border border-green-100 dark:border-green-800/30">
            {message}
          </div>
        )}

        {showDetails && (
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Company Details</h2>
            <form onSubmit={handleUpdateDetails} className="space-y-4 max-w-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={details.contact_person}
                    onChange={(e) => setDetails({ ...details, contact_person: e.target.value })}
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
                    value={details.contact_email}
                    onChange={(e) => setDetails({ ...details, contact_email: e.target.value })}
                    className="input-field"
                    placeholder="admin@company.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={details.contact_phone}
                    onChange={(e) => setDetails({ ...details, contact_phone: e.target.value })}
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
                    value={details.address}
                    onChange={(e) => setDetails({ ...details, address: e.target.value })}
                    className="input-field"
                    placeholder="123 Business Street, City"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Save Details
                </button>
                <button
                  type="button"
                  onClick={() => setShowDetails(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Company Name</p>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{company?.name}</h3>
              </div>
              <Building2 className="w-8 h-8 text-blue-500 dark:text-blue-400" />
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Subscription Tier</p>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {company?.subscription_tier?.charAt(0).toUpperCase() + company?.subscription_tier?.slice(1)}
                </h3>
              </div>
              <LayoutGrid className="w-8 h-8 text-blue-500 dark:text-blue-400" />
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {company?.status?.charAt(0).toUpperCase() + company?.status?.slice(1)}
                </h3>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                company?.status === 'active'
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                  : company?.status === 'suspended'
                  ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                  : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
              }`}>
                {company?.status}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Contact Person</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{details.contact_person || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Contact Email</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{details.contact_email || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Contact Phone</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{details.contact_phone || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Address</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{details.address || 'Not set'}</p>
              </div>
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  );
}
