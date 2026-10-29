import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { LayoutGrid, ShoppingCart, FolderKanban, LogOut, Menu, User as UserIcon } from 'lucide-react';

export default function Layout() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Wait for auth to load before rendering
  if (loading) return null;

  const isSuperAdmin = user?.role === 'super_admin';
  const isCompanyAdmin = user?.role === 'company_admin';
  const isEmployee = user?.role === 'employee';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className="glass-card fixed inset-y-0 left-0 z-50 w-64 border-r transform transition-transform duration-300 ease-in-out -translate-x-full md:translate-x-0 md:relative md:shadow-none">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">Awiad ERP</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {user?.company_name || 'Master Admin'}
          </p>
        </div>

        <nav className="p-4 space-y-1">
          {isSuperAdmin && (
            <>
              <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Super Admin
              </div>
              <button
                onClick={() => navigate('/admin')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  window.location.pathname === '/admin'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
                Master Admin
              </button>
            </>
          )}

          <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4">
            Modules
          </div>

          <button
            onClick={() => navigate('/home')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              window.location.pathname === '/home'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            Home Hub
          </button>

          {isCompanyAdmin || isEmployee ? (
            <>
              <button
                onClick={() => navigate('/sales')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  window.location.pathname === '/sales'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                Sales
              </button>

              <button
                onClick={() => navigate('/projects')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  window.location.pathname === '/projects'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <FolderKanban className="w-5 h-5" />
                Projects
              </button>
            </>
          ) : null}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:pl-64">
        {/* Mobile Header */}
        <header className="glass-card md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 dark:text-gray-300"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">{user?.company_name || 'Ariad ERP'}</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">{user?.name}</span>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}