import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';
import { LayoutGrid, ShoppingCart, FolderKanban, LogOut, Menu, ChevronLeft, Sun, Moon, User, Building2, PanelLeftClose } from 'lucide-react';

/* ---------- Brand Logo Component ---------- */
export function AwiadLogo({ height = 40, className = "", collapsed = false }) {
  if (collapsed) {
    return (
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr from-brand to-cyan-400 flex items-center justify-center shadow-lg shadow-brand/20 shrink-0 ${className}`}>
        <span className="text-white font-black text-lg" style={{ color: '#ffffff' }}>A</span>
      </div>
    );
  }
  return (
    <svg
      className={className}
      viewBox="0 0 230 64"
      height={height}
      role="img"
      aria-label="AWIAD ERP"
    >
      <defs>
        <linearGradient id="awiad-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#awiad-grad)" />
      <path d="M19 47 L32 17 L45 47" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="24.5" y="35" width="15" height="5.5" rx="2.75" fill="#fff" />
      <circle cx="32" cy="17" r="4" fill="#fff" />
      <circle cx="19" cy="47" r="3" fill="#fff" fillOpacity=".55" />
      <circle cx="45" cy="47" r="3" fill="#fff" fillOpacity=".55" />
      
      <text className="fill-gray-900 dark:fill-white" x="80" y="39" fontSize="35" fontWeight="800" textLength="146" lengthAdjust="spacingAndGlyphs">AWIAD</text>
      <text className="fill-blue-500 dark:fill-cyan-400" x="81" y="57" fontSize="13" fontWeight="700" textLength="70">ERP</text>
      <rect className="fill-blue-500 dark:fill-cyan-400" x="160" y="52" width="66" height="2.5" rx="1.25" fillOpacity=".35" />
    </svg>
  );
}

export default function Layout() {
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (loading) return null;

  const isSuperAdmin = user?.role === 'super_admin';
  const isCompanyAdmin = user?.role === 'company_admin';
  const isEmployee = user?.role === 'employee';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const NavItem = ({ path, icon: Icon, label, hidden }) => {
    if (hidden) return null;
    return (
      <button
        onClick={() => navigate(path)}
        title={sidebarCollapsed ? label : undefined}
        className={`w-full flex items-center rounded-xl text-sm font-medium transition-all duration-200 group ${
          sidebarCollapsed ? 'justify-center py-3 px-0' : 'justify-start py-2.5 px-4 gap-3'
        } ${
          isActive(path)
            ? 'bg-brand/10 text-brand border border-brand/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
            : 'text-premium-textMuted hover:bg-premium-bg/50 hover:text-premium-text border border-transparent'
        }`}
      >
        <Icon className={`w-5 h-5 shrink-0 ${isActive(path) ? 'text-brand' : 'text-premium-textMuted group-hover:text-brand transition-colors'}`} />
        {!sidebarCollapsed && <span className="truncate">{label}</span>}
      </button>
    );
  };

  return (
    <div className="h-screen bg-premium-dark text-premium-text flex flex-col overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[30%] h-[30%] rounded-full bg-brand/5 blur-[120px]" />
      </div>

      <div className="flex flex-1 overflow-hidden relative items-start z-10">
        
        {/* Sidebar */}
        <aside
          className={`transition-all duration-300 z-50 flex flex-col overflow-hidden ${
            isDesktop 
              ? `glass-card my-4 ml-4 md:my-6 md:ml-6 rounded-2xl border border-premium-border/50 h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] ${sidebarCollapsed ? 'w-[88px]' : 'w-72'}`
              : `fixed inset-y-0 left-0 h-full w-72 bg-premium-card/95 backdrop-blur-2xl border-r border-premium-border/50 shadow-2xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
          }`}
        >
          {/* Header - Dynamically adjusts layout so nothing crashes */}
          <div className={`p-4 border-b border-premium-border/50 bg-premium-bg/30 flex transition-all ${
            sidebarCollapsed 
              ? 'flex-col items-center justify-center py-6 gap-5' 
              : 'items-center justify-between h-[73px]'
          }`}>
            {/* Logo Wrapper */}
            <div className="flex items-center justify-center shrink-0">
              {sidebarCollapsed ? <AwiadLogo collapsed={true} /> : <AwiadLogo height={32} />}
            </div>

            {/* Controls */}
            {isDesktop ? (
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-xl bg-premium-bg border border-premium-border/50 text-premium-textMuted hover:text-brand hover:border-brand/30 transition-all shrink-0"
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <PanelLeftClose className={`w-4 h-4 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} />
              </button>
            ) : (
               <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-xl bg-premium-bg border border-premium-border/50 text-premium-textMuted transition-all shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Navigation Area with fixed spacing groups */}
          <nav className="p-3 space-y-6 flex-1 overflow-y-auto mb-24 custom-scrollbar">
            {isSuperAdmin && (
              <div className="space-y-1.5">
                {!sidebarCollapsed && (
                  <div className="px-4 py-1 text-[0.65rem] font-bold text-premium-textMuted uppercase tracking-wider">
                    Super Admin
                  </div>
                )}
                <NavItem path="/admin" icon={LayoutGrid} label="Master Admin" />
              </div>
            )}

            {isCompanyAdmin && (
              <div className="space-y-1.5">
                {!sidebarCollapsed && (
                  <div className="px-4 py-1 text-[0.65rem] font-bold text-premium-textMuted uppercase tracking-wider">
                    Administration
                  </div>
                )}
                <NavItem path="/company-admin" icon={Building2} label="Company Profile" />
                <NavItem path="/employees" icon={User} label="Employees" />
              </div>
            )}

            <div className="space-y-1.5">
              {!sidebarCollapsed && (
                <div className="px-4 py-1 text-[0.65rem] font-bold text-premium-textMuted uppercase tracking-wider">
                  Workspace
                </div>
              )}
              <NavItem path="/home" icon={LayoutGrid} label="Home Hub" />
              <NavItem path="/sales" icon={ShoppingCart} label="Sales" hidden={!isCompanyAdmin && !isEmployee} />
              <NavItem path="/projects" icon={FolderKanban} label="Projects" hidden={!isCompanyAdmin && !isEmployee} />
            </div>
          </nav>

          {/* User Profile, Theme Toggle & Sign Out Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-premium-border/50 bg-premium-card/60 backdrop-blur-xl">
            <div className={`flex ${sidebarCollapsed ? 'flex-col items-center gap-4' : 'flex-col gap-3'}`}>
              
              <div className={`flex items-center gap-3 overflow-hidden w-full ${sidebarCollapsed ? 'justify-center' : ''}`}>
                <div 
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-sm shrink-0 shadow-md shadow-brand/20 border border-brand/20"
                  style={{ color: '#ffffff' }}
                >
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                {!sidebarCollapsed && (
                  <div className="flex flex-col truncate flex-1">
                    <span className="text-sm font-bold text-premium-text truncate">{user?.name || 'User Name'}</span>
                    <span className="text-[0.65rem] text-premium-textMuted font-semibold uppercase tracking-wider truncate">
                      {user?.role?.replace('_', ' ')}
                    </span>
                  </div>
                )}
              </div>

              <div className={`flex items-center gap-2 w-full ${sidebarCollapsed ? 'flex-col' : 'justify-between'}`}>
                 <button
                  onClick={toggleTheme}
                  className={`p-2.5 rounded-xl text-premium-textMuted hover:text-brand hover:bg-brand/10 transition-all border border-transparent hover:border-brand/20 group shrink-0 ${sidebarCollapsed ? 'w-full flex justify-center' : 'flex-1 flex justify-center gap-2'}`}
                  title="Toggle Theme"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 group-hover:scale-110 transition-transform" /> : <Moon className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                  {!sidebarCollapsed && <span className="text-xs font-semibold">Theme</span>}
                </button>

                <button
                  onClick={handleLogout}
                  className={`p-2.5 rounded-xl text-premium-textMuted hover:text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20 group shrink-0 ${sidebarCollapsed ? 'w-full flex justify-center' : 'flex-1 flex justify-center gap-2'}`}
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                   {!sidebarCollapsed && <span className="text-xs font-semibold">Sign Out</span>}
                </button>
              </div>

            </div>
          </div>
        </aside>

        {!isDesktop && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex-1 overflow-y-auto h-full bg-transparent flex flex-col">
          
          {/* Top Header */}
          <header className="glass-card flex items-center justify-between border border-premium-border/50 sticky top-0 z-30 mx-4 md:mx-6 mt-4 md:mt-6 px-4 md:px-6 py-3.5 rounded-2xl shadow-glass bg-premium-card/60">
            <div className="flex items-center gap-3">
              {!isDesktop && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-xl bg-premium-bg border border-premium-border/50 text-premium-textMuted hover:text-brand transition-all md:hidden"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}
              <div className="flex flex-col">
                <span className="text-base font-bold text-premium-text tracking-tight">
                  {user?.company_name || 'System Administration'}
                </span>
              </div>
            </div>

            <div className="flex items-center">
                 <span className="text-sm font-medium text-premium-textMuted hidden sm:block">
                  Welcome to the workspace
                </span>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6 pb-20">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}