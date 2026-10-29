import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';
import { LayoutGrid, ShoppingCart, FolderKanban, LogOut, Menu, ChevronLeft, Sun, Moon, User, Building2 } from 'lucide-react';

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
    <div className="h-screen bg-premium-dark dark:bg-premium-dark text-premium-text dark:text-premium-text flex flex-col">
      {/* Desktop + Mobile Wrapper - full height */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar - covers full height */}
        <aside
          className={`border-r border-premium-border transition-all duration-300 z-50 min-h-full self-start ${isDesktop ? 'glass-card' : 'bg-premium-card/95 backdrop-blur-xl'} ${isDesktop ? (sidebarCollapsed ? 'w-20' : 'w-72') : 'fixed inset-y-0 left-0 w-72'} ${!isDesktop ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : ''} ${isDesktop ? 'mt-4 md:mt-6 mb-4 md:mb-6 ml-4 md:ml-6' : ''}`}
        >
          {/* Sidebar Header with collapse button inside */}
          <div className="p-5 border-b border-premium-border flex items-center justify-between relative">
            {isDesktop && (
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2.5 rounded-xl bg-white/10 dark:bg-premium-card/50 text-premium-textMuted dark:text-premium-textMuted hover:bg-white/20 dark:hover:bg-premium-card/70 transition-all"
                title="Collapse sidebar"
              >
                <ChevronLeft className={`w-4 h-4 ${sidebarCollapsed ? 'rotate-180' : ''}`} />
              </button>
            )}
            {!isDesktop && (
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-white/10 dark:bg-premium-card/50 text-premium-textMuted dark:text-premium-textMuted hover:bg-white/20 dark:hover:bg-premium-card/70 transition-all"
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
                  <div className="px-4 py-2.5 text-[0.7rem] font-semibold text-premium-textMuted uppercase tracking-wider">
                    Super Admin
                  </div>
                )}
                <button
                  onClick={() => navigate('/admin')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    window.location.pathname === '/admin'
                      ? 'sidebar-item-active'
                      : 'sidebar-item'
                  }`}
                >
                  <LayoutGrid className={`w-5 h-5 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
                  {!sidebarCollapsed && <span>Master Admin</span>}
                </button>
              </>
            )}

            {isCompanyAdmin && (
              <>
                {!sidebarCollapsed && (
                  <div className="px-4 py-2.5 text-[0.7rem] font-semibold text-premium-textMuted uppercase tracking-wider mt-6">
                    Company Admin
                  </div>
                )}
                <button
                  onClick={() => navigate('/company-admin')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    window.location.pathname === '/company-admin'
                      ? 'sidebar-item-active'
                      : 'sidebar-item'
                  }`}
                >
                  <Building2 className={`w-5 h-5 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
                  {!sidebarCollapsed && <span>Company Dashboard</span>}
                </button>
                <button
                  onClick={() => navigate('/employees')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    window.location.pathname === '/employees'
                      ? 'sidebar-item-active'
                      : 'sidebar-item'
                  }`}
                >
                  <User className={`w-5 h-5 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
                  {!sidebarCollapsed && <span>Employees</span>}
                </button>
              </>
            )}

            {!sidebarCollapsed && (
              <div className="px-4 py-2.5 text-[0.7rem] font-semibold text-premium-textMuted uppercase tracking-wider mt-6">
                Modules
              </div>
            )}

            <button
              onClick={() => navigate('/home')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                window.location.pathname === '/home'
                  ? 'sidebar-item-active'
                  : 'sidebar-item'
              }`}
            >
              <LayoutGrid className={`w-5 h-5 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
              {!sidebarCollapsed && <span>Home Hub</span>}
            </button>

            {isCompanyAdmin || isEmployee ? (
              <>
                <button
                  onClick={() => navigate('/sales')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    window.location.pathname === '/sales'
                      ? 'sidebar-item-active'
                      : 'sidebar-item'
                  }`}
                >
                  <ShoppingCart className={`w-5 h-5 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
                  {!sidebarCollapsed && <span>Sales</span>}
                </button>

                <button
                  onClick={() => navigate('/projects')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    window.location.pathname === '/projects'
                      ? 'sidebar-item-active'
                      : 'sidebar-item'
                  }`}
                >
                  <FolderKanban className={`w-5 h-5 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
                  {!sidebarCollapsed && <span>Projects</span>}
                </button>
              </>
            ) : null}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-premium-border">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-premium-error dark:text-premium-error hover:bg-premium-error/10 dark:hover:bg-premium-error/10 transition-all border border-premium-error/20 ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <LogOut className="w-5 h-5" />
              {!sidebarCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {!isDesktop && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/70 z-40 backdrop-blur-md"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content - header width adjusts dynamically with sidebar */}
        <div className="flex-1 overflow-y-auto bg-premium-dark dark:bg-premium-dark flex flex-col">
          {/* Content Header - matches main content padding */}
          <header className={`glass-card flex items-center justify-between border-b border-premium-border sticky top-0 z-30 mx-4 md:mx-6 mt-4 md:mt-6 ${sidebarCollapsed ? 'px-4' : 'px-6'} py-4`}>
            <div className="flex items-center gap-3">
              {!isDesktop && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2.5 rounded-xl bg-white/10 dark:bg-premium-card/50 text-premium-textMuted dark:text-premium-textMuted hover:bg-white/20 dark:hover:bg-premium-card/70 transition-all md:hidden"
                  title="Open menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}
              <h1 className="text-xl font-bold text-premium-accent dark:text-premium-accent tracking-tight">Awiad ERP</h1>
              <span className="text-xs text-premium-textMuted dark:text-premium-textMuted ml-2 font-medium">{user?.company_name || 'Master Admin'}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-sm text-premium-textMuted dark:text-premium-textMuted font-medium">{user?.name}</div>
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