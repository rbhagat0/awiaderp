import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Plus, Trash2, Edit3 } from 'lucide-react';

export default function MasterAdminPage() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCompany, setNewCompany] = useState({ name: '', subscription_tier: 'starter', status: 'active' });
  const [showForm, setShowForm] = useState(false);

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

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    try {
      await api.post('/companies', newCompany);
      setShowForm(false);
      setNewCompany({ name: '', subscription_tier: 'starter', status: 'active' });
      fetchCompanies();
    } catch (err) {
      console.error(err);
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
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Company
        </button>
      </div>

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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Onboard New Company</h2>
          <form onSubmit={handleCreateCompany} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={newCompany.name}
                onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                className="input-field"
                placeholder="Acme Corporation"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subscription Tier
              </label>
              <select
                value={newCompany.subscription_tier}
                onChange={(e) => setNewCompany({ ...newCompany, subscription_tier: e.target.value })}
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
                value={newCompany.status}
                onChange={(e) => setNewCompany({ ...newCompany, status: e.target.value })}
                className="input-field"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn-primary flex-1">Create Company</button>
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
    </div>
  );
}