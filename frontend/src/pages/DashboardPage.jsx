import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Users, Building2, CreditCard, Clock, LayoutDashboard, ArrowRight, Sparkles, Activity } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    companies: 0,
    users: 0,
    clients: 0,
    projects: 0,
  });
  const [loading, setLoading] = useState(true);

  // Mock data for the table
  const recentActivity = [
    { id: 1, action: "New client onboarded", entity: "TechCorp Inc.", time: "2 hours ago", status: "Completed" },
    { id: 2, action: "Project milestone reached", entity: "Website Redesign", time: "5 hours ago", status: "In Progress" },
    { id: 3, action: "Invoice generated", entity: "INV-2026-042", time: "1 day ago", status: "Pending" },
    { id: 4, action: "User account created", entity: "sarah.j@techcorp.com", time: "2 days ago", status: "Completed" },
  ];

  useEffect(() => {
    if (user?.role === 'super_admin') {
      fetchStats();
    } else {
      setLoading(false);
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
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-[80px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-premium-accent/5 rounded-full blur-[80px] pointer-events-none -z-10" />

      {/* Header Section */}
      <div className="glass-panel p-6 md:p-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="inline-flex items-center justify-center p-2.5 bg-brand/10 text-brand rounded-xl border border-brand/20">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-premium-text tracking-tight">
              {isSuperAdmin ? 'Master Admin Dashboard' : 'Workspace Overview'}
            </h1>
            <p className="text-sm text-premium-textMuted font-medium mt-1">
              {isSuperAdmin
                ? 'Manage your tenant companies and system metrics'
                : 'Welcome back to your company workspace'}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-premium-border border-t-brand rounded-full animate-spin" />
            <p className="text-sm font-medium text-premium-textMuted animate-pulse">Loading dashboard metrics...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Companies"
              value={stats.companies}
              icon={<Building2 className="w-6 h-6" />}
              colorClass="bg-blue-500/10 text-blue-500 border-blue-500/20"
            />
            <StatCard
              title="Active Users"
              value={stats.users}
              icon={<Users className="w-6 h-6" />}
              colorClass="bg-green-500/10 text-green-500 border-green-500/20"
            />
            <StatCard
              title="Clients"
              value={stats.clients}
              icon={<CreditCard className="w-6 h-6" />}
              colorClass="bg-purple-500/10 text-purple-500 border-purple-500/20"
            />
            <StatCard
              title="Projects"
              value={stats.projects}
              icon={<Clock className="w-6 h-6" />}
              colorClass="bg-orange-500/10 text-orange-500 border-orange-500/20"
            />
          </div>

          {/* Quick Actions (Super Admin Only) */}
          {isSuperAdmin && (
            <div className="glass-card p-6 md:p-8 relative overflow-hidden group">
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-brand/5 rounded-full blur-[30px] group-hover:bg-brand/10 transition-colors pointer-events-none" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div>
                  <h2 className="text-xl font-bold text-premium-text tracking-tight mb-2">
                    Quick Actions
                  </h2>
                  <p className="text-sm text-premium-textMuted font-medium">
                    Need to register a new tenant? Get them set up instantly.
                  </p>
                </div>
                <button
                  className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap shadow-brand/20 shadow-lg"
                  onClick={() => window.location.href = '/admin'}
                >
                  Onboard New Company <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Glassmorphism Table Section */}
          <div className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-premium-border/30 rounded-lg text-premium-textMuted">
                 <Activity className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-premium-text">Recent Activity</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="premium-table w-full">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Entity</th>
                    <th>Status</th>
                    <th className="text-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((item) => (
                    <tr key={item.id} className="group">
                      <td className="font-medium">{item.action}</td>
                      <td className="text-premium-textMuted">{item.entity}</td>
                      <td>
                         <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                           item.status === 'Completed' 
                            ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                            : item.status === 'In Progress'
                            ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                            : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                         }`}>
                           {item.status}
                         </span>
                      </td>
                      <td className="text-right text-xs text-premium-textMuted font-medium">{item.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, colorClass }) {
  return (
    <div className="glass-card p-6 flex flex-col justify-between group hover:border-brand/30 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl border group-hover:scale-110 transition-transform ${colorClass}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-premium-text tracking-tight">{value}</h3>
      </div>
    </div>
  );
}