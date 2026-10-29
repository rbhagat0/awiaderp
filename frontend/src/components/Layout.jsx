import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';
import { LayoutGrid, ShoppingCart, FolderKanban, LogOut, Menu, ChevronLeft, Sun, Moon } from 'lucide-react';

export default function Layout() {
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <div className="h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col">
      {/* Desktop + Mobile Wrapper - full height */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar - covers full height */}
        <aside
          className={`border-r transition-all duration-300 z-50 h-full ${isDesktop ? 'glass-card' : 'bg-white dark:bg-gray-900'} ${isDesktop ? (sidebarCollapsed ? 'w-16' : 'w-64') : 'fixed inset-y-0 left-0 w-64'} ${!isDesktop ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : ''}`}
        >
          {/* Sidebar Header with collapse button inside */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between relative">
            {isDesktop && (
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                title="Collapse sidebar"
              >
                <ChevronLeft className={`w-4 h-4 ${sidebarCollapsed ? 'rotate-180' : ''}`} />
              </button>
            )}
            {!isDesktop && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                title="Toggle dark mode"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}
          </div>

          <nav className="p-2 space-y-1">
            {isSuperAdmin && (
              <>
                {!sidebarCollapsed && (
                  <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Super Admin
                  </div>
                )}
                <button
                  onClick={() => navigate('/admin')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    window.location.pathname === '/admin'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <LayoutGrid className={`w-5 h-5 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
                  {!sidebarCollapsed && <span>Master Admin</span>}
                </button>
              </>
            )}

            {!sidebarCollapsed && (
              <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4">
                Modules
              </div>
            )}

            <button
              onClick={() => navigate('/home')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                window.location.pathname === '/home'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <LayoutGrid className={`w-5 h-5 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
              {!sidebarCollapsed && <span>Home Hub</span>}
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
                  <ShoppingCart className={`w-5 h-5 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
                  {!sidebarCollapsed && <span>Sales</span>}
                </button>

                <button
                  onClick={() => navigate('/projects')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    window.location.pathname === '/projects'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <FolderKanban className={`w-5 h-5 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
                  {!sidebarCollapsed && <span>Projects</span>}
                </button>
              </>
            ) : null}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ${
                sidebarCollapsed ? 'justify-center' : ''
              }`}
            >
              <LogOut className="w-5 h-5" />
              {!sidebarCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {!isDesktop && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content - header width adjusts dynamically with sidebar */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 flex flex-col">
          {/* Content Header - dynamic width based on sidebar state */}
          <header className="glass-card flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              {!isDesktop && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors md:hidden"
                  title="Open menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}
              <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">Awiad ERP</h1>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{user?.company_name || 'Master Admin'}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-sm text-gray-600 dark:text-gray-400">{user?.name}</div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}