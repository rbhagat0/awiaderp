import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Plus, Trash2, Edit3, Search, User as UserIcon } from 'lucide-react';

export default function SalesPage() {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('clients');
  const [showClientForm, setShowClientForm] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', address: '', status: 'active' });
  const [newLead, setNewLead] = useState({ client_id: '', title: '', value: '', status: 'new', expected_close_date: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [clientsRes, leadsRes] = await Promise.all([
        api.get('/clients'),
        api.get('/leads'),
      ]);
      setClients(clientsRes.data);
      setLeads(leadsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    try {
      await api.post('/clients', newClient);
      setShowClientForm(false);
      setNewClient({ name: '', email: '', phone: '', address: '', status: 'active' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leads', newLead);
      setShowLeadForm(false);
      setNewLead({ client_id: '', title: '', value: '', status: 'new', expected_close_date: '' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClient = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/clients/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteLead = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/leads/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sales CRM</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your clients and sales pipeline
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowClientForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Client
          </button>
          <button
            onClick={() => setShowLeadForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
        <button
          onClick={() => setActiveTab('clients')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'clients'
              ? 'border-b-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Clients ({clients.length})
        </button>
        <button
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'leads'
              ? 'border-b-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Leads ({leads.length})
        </button>
      </div>

      {activeTab === 'clients' && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Client Contacts</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                className="input-field pl-9"
                placeholder="Search clients..."
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">Email</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">Phone</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-b border-gray-100 dark:border-gray-700/50">
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{client.name}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{client.email || '-'}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{client.phone || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        client.status === 'active'
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteClient(client.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {clients.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No clients found. Add your first client.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'leads' && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sales Leads</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">Title</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">Client</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">Value</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-gray-100 dark:border-gray-700/50">
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{lead.title}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{lead.client_name || '-'}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">${lead.value || '0'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lead.status === 'new'
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                          : lead.status === 'won'
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No leads found. Add your first lead.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showClientForm && (
        <div className="glass-card p-6 max-w-md">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Client</h2>
          <form onSubmit={handleCreateClient} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Client Name
              </label>
              <input
                type="text"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={newClient.phone}
                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address
              </label>
              <textarea
                value={newClient.address}
                onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                className="input-field"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={newClient.status}
                onChange={(e) => setNewClient({ ...newClient, status: e.target.value })}
                className="input-field"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn-primary flex-1">Create Client</button>
              <button
                type="button"
                onClick={() => setShowClientForm(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showLeadForm && (
        <div className="glass-card p-6 max-w-md">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Lead</h2>
          <form onSubmit={handleCreateLead} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Client
              </label>
              <select
                value={newLead.client_id}
                onChange={(e) => setNewLead({ ...newLead, client_id: e.target.value })}
                className="input-field"
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Lead Title
              </label>
              <input
                type="text"
                value={newLead.title}
                onChange={(e) => setNewLead({ ...newLead, title: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Value ($)
              </label>
              <input
                type="number"
                value={newLead.value}
                onChange={(e) => setNewLead({ ...newLead, value: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={newLead.status}
                onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
                className="input-field"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal Sent</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Expected Close Date
              </label>
              <input
                type="date"
                value={newLead.expected_close_date}
                onChange={(e) => setNewLead({ ...newLead, expected_close_date: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn-primary flex-1">Create Lead</button>
              <button
                type="button"
                onClick={() => setShowLeadForm(false)}
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