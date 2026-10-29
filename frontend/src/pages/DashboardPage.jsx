import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Users, Building2, CreditCard, Clock } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    companies: 0,
    users: 0,
    clients: 0,
    projects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'super_admin') {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const [companiesRes, usersRes] = await Promise.all([
        api.get('/companies'),
        api.get('/auth/profile'),
      ]);
      setStats({
        companies: companiesRes.data.length,
        users: 1,
        clients: 0,
        projects: 0,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isSuperAdmin = user?.role === 'super_admin';

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isSuperAdmin ? 'Master Admin Dashboard' : 'Dashboard'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {isSuperAdmin
            ? 'Manage your tenant companies and subscriptions'
            : 'Welcome to your company workspace'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Companies"
          value={stats.companies}
          icon={<Building2 className="w-6 h-6" />}
          color="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Active Users"
          value={stats.users}
          icon={<Users className="w-6 h-6" />}
          color="bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
        />
        <StatCard
          title="Clients"
          value={stats.clients}
          icon={<CreditCard className="w-6 h-6" />}
          color="bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
        />
        <StatCard
          title="Projects"
          value={stats.projects}
          icon={<Clock className="w-6 h-6" />}
          color="bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
        />
      </div>

      {isSuperAdmin && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="flex gap-3">
            <button
              className="btn-primary"
              onClick={() => window.location.href = '/admin'}
            >
              Onboard New Company
            </button>
          </div>
        </div>
      )}

      {!isSuperAdmin && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Company Overview
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome, {user?.name}. You are logged in as a{' '}
            <span className="font-medium capitalize">{user?.role}</span>{' '}
            at {user?.company_name}.
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className={`glass-card p-5 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </h3>
        </div>
        <div className="w-10 h-10 rounded-lg bg-white/30 dark:bg-white/10 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
}