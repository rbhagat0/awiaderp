import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useTheme } from '../context/ThemeContext';
import {
  Mail, Lock, ArrowRight, Sun, Moon, Eye, EyeOff, Mail as MailIcon, AlertCircle, Loader2
} from 'lucide-react';

/* ---------- Brand Logo Component ---------- */
export function AwiadLogo({ height = 40, className = "" }) {
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
      <text className="fill-premium-text" x="80" y="39" fontSize="35" fontWeight="800" textLength="146" lengthAdjust="spacingAndGlyphs">AWIAD</text>
      <text className="fill-brand" x="81" y="57" fontSize="13" fontWeight="700" textLength="70">ERP</text>
      <rect className="fill-brand" x="160" y="52" width="66" height="2.5" rx="1.25" fillOpacity=".35" />
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState('role'); // role, email, otp, success
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotRole, setForgotRole] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [requiresApproval, setRequiresApproval] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      if (rememberMe) localStorage.setItem('remember_email', email);
      else localStorage.removeItem('remember_email');

      if (user.role === 'super_admin') navigate('/admin');
      else if (user.role === 'company_admin') navigate('/company-admin');
      else navigate('/home');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setForgotLoading(true);
      const response = await api.post('/auth/forgot-password', { email: forgotEmail, role: forgotRole });
      setRequiresApproval(response.data.requiresApproval || false);
      setForgotStep('success');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset link.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-premium-dark relative overflow-hidden px-4">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand/10 blur-[120px] pointer-events-none" />

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-3 rounded-2xl bg-premium-card/40 backdrop-blur-md text-premium-textMuted hover:text-premium-text hover:bg-premium-card/60 transition-all border border-premium-border/50 shadow-glass"
        title="Toggle dark mode"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Glass Modal */}
      <div className="w-full max-w-md bg-premium-card/60 backdrop-blur-2xl border border-premium-border/50 shadow-premium-lg rounded-3xl p-8 md:p-10 relative z-10">
        
        {forgotMode ? (
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <div className="flex justify-center mb-8">
              <AwiadLogo height={48} />
            </div>

            {forgotStep === 'role' && (
              <>
                <h1 className="text-2xl font-bold text-premium-text tracking-tight mb-2">Forgot Password</h1>
                <p className="text-sm text-premium-textMuted mb-8">Select your account type</p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <button
                    onClick={() => { setForgotRole('company_admin'); setForgotStep('email'); }}
                    className="p-4 rounded-2xl border border-premium-border bg-premium-bg/50 hover:bg-premium-card/40 transition-colors text-left"
                  >
                    <div className="font-semibold text-premium-text">Company Admin</div>
                    <div className="text-xs text-premium-textMuted mt-1">Direct reset link</div>
                  </button>
                  <button
                    onClick={() => { setForgotRole('employee'); setForgotStep('email'); }}
                    className="p-4 rounded-2xl border border-premium-border bg-premium-bg/50 hover:bg-premium-card/40 transition-colors text-left"
                  >
                    <div className="font-semibold text-premium-text">Employee</div>
                    <div className="text-xs text-premium-textMuted mt-1">Needs admin approval</div>
                  </button>
                </div>
                <button onClick={() => { setForgotMode(false); setForgotStep('role'); }} className="mt-8 text-sm font-semibold text-premium-textMuted hover:text-brand transition-colors">
                  ← Back to sign in
                </button>
              </>
            )}

            {forgotStep === 'email' && (
              <>
                <h1 className="text-2xl font-bold text-premium-text tracking-tight mb-2">Forgot Password</h1>
                <p className="text-sm text-premium-textMuted mb-8">
                  {forgotRole === 'employee'
                    ? 'Enter your email. Your company admin will approve the reset.'
                    : 'Enter your email and we\'ll send you a reset link.'}
                </p>
                <form onSubmit={handleForgotPassword} className="space-y-5 text-left">
                  <div>
                    <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-2 ml-1">Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-premium-textMuted group-focus-within:text-brand transition-colors" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                        className="input-field pl-12 py-3.5 bg-premium-bg/50 backdrop-blur-sm"
                        placeholder="you@company.com"
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={forgotLoading} className="btn-primary w-full py-3.5 flex justify-center items-center gap-2">
                    {forgotLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <>Send Reset Request <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
                <button onClick={() => setForgotStep('role')} className="mt-6 text-sm font-semibold text-premium-textMuted hover:text-brand transition-colors">
                  ← Change account type
                </button>
              </>
            )}

            {forgotStep === 'success' && (
              <>
                <h1 className="text-2xl font-bold text-premium-text tracking-tight mb-2">
                  {requiresApproval ? 'Request Submitted' : 'Reset Link Sent'}
                </h1>
                <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 mb-8">
                  <p className="text-sm font-semibold">
                    {requiresApproval
                      ? 'Your reset request has been submitted to your company admin for approval.'
                      : 'Reset link sent!'}
                  </p>
                  <p className="text-xs opacity-80 mt-1">
                    {requiresApproval
                      ? 'You will be notified once approved.'
                      : 'Check your inbox for instructions.'}
                  </p>
                </div>
                <button onClick={() => { setForgotMode(false); setForgotStep('role'); setForgotSuccess(false); setRequiresApproval(false); }} className="mt-8 text-sm font-semibold text-premium-textMuted hover:text-brand transition-colors">
                  ← Back to sign in
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <div className="flex justify-center mb-8">
              <AwiadLogo height={48} />
            </div>
            
            {/* Keeping the text structure from your screenshot, removing "Welcome Back" as the logo serves as the hero */}
            <h1 className="text-xl font-bold text-premium-text tracking-tight mb-1">Sign in</h1>
            <p className="text-sm text-premium-textMuted mb-8">to your Awiad ERP workspace</p>

            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-start gap-3 text-left">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              <div>
                <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-2 ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-premium-textMuted group-focus-within:text-brand transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-field pl-12 py-3.5 bg-premium-bg/50 backdrop-blur-sm"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2 ml-1 mr-1">
                  <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider">Password</label>
                  <button type="button" onClick={() => setForgotMode(true)} className="text-xs font-semibold text-brand hover:text-brand-hover transition-colors">
                    Forgot?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-premium-textMuted group-focus-within:text-brand transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-field pl-12 pr-12 py-3.5 bg-premium-bg/50 backdrop-blur-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-premium-textMuted hover:text-premium-text transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-1 pt-1">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="w-4 h-4 rounded border-premium-border text-brand focus:ring-brand/20 bg-premium-bg/50"
                />
                <label htmlFor="remember-me" className="text-sm font-medium text-premium-textMuted cursor-pointer select-none">
                  Keep me signed in
                </label>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full mt-4 py-3.5 flex justify-center items-center gap-2 shadow-brand/20">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}