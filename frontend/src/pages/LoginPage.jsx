import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useTheme } from '../context/ThemeContext';
import {
  Mail,
  Lock,
  User,
  ShieldAlert,
  ArrowRight,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Mail as MailIcon,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
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
      if (rememberMe) {
        localStorage.setItem('remember_email', email);
      } else {
        localStorage.removeItem('remember_email');
      }

      if (user.role === 'super_admin') {
        navigate('/admin');
      } else if (user.role === 'company_admin') {
        navigate('/company-admin');
      } else {
        navigate('/home');
      }
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
      await api.post('/auth/forgot-password', { email: forgotEmail });
      setForgotSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset link.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setForgotMode(false);
    setForgotSuccess(false);
    setForgotEmail('');
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-premium-dark px-4">
      {/* Theme toggle in corner */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-2.5 rounded-xl bg-premium-card/10 text-premium-textMuted hover:bg-premium-card/20 transition-all border-premium-border/20 border"
        title="Toggle dark mode"
        aria-label="Toggle dark mode"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>

      <div className="w-full max-w-md glass-modal p-8">
        {forgotMode ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-brand/10 rounded-xl mb-4 shadow-premium">
              <MailIcon className="w-6 h-6 text-brand" />
            </div>
            <h1 className="section-title">Forgot Password</h1>
            <p className="section-subtitle mt-2">
              Enter your email and we'll send you a link to reset your password.
            </p>

            {forgotSuccess ? (
              <div className="mt-6 p-4 rounded-xl bg-premium-success/10 text-premium-success border border-premium-success/20">
                <p className="text-sm font-medium">Reset link sent!</p>
                <p className="text-xs text-premium-textMuted mt-1">
                  Check your inbox for instructions to reset your password.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-premium-textMuted mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-premium-textMuted" />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      className="input-field pl-10"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {forgotLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Link <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            <button
              onClick={handleBackToLogin}
              className="mt-6 text-sm text-brand hover:text-brand-hover transition-colors underline underline-offset-4"
            >
              Back to sign in
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-brand/10 rounded-xl mb-4 shadow-premium">
              <ShieldAlert className="w-6 h-6 text-brand" />
            </div>
            <h1 className="section-title">Welcome back</h1>
            <p className="section-subtitle mt-2">Sign in to your Awiad ERP account</p>

            <button
              onClick={toggleTheme}
              className="mt-4 p-2.5 rounded-xl bg-premium-card/10 text-premium-textMuted hover:bg-premium-card/20 transition-all border-premium-border/20 border"
              title="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {error && (
              <div className="mb-6 p-3 rounded-xl bg-danger-bg text-danger text-sm border border-danger/20 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-premium-textMuted mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-premium-textMuted" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-field pl-10"
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-premium-textMuted">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-premium-textMuted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-field pl-10 pr-10"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-premium-textMuted hover:text-premium-text transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="w-4 h-4 rounded text-brand focus:ring-brand border-premium-border bg-premium-bg-secondary"
                />
                <label
                  htmlFor="remember-me"
                  className="text-sm text-premium-textMuted cursor-pointer select-none"
                >
                  Keep me signed in
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center space-y-3">
              <button
                onClick={() => setForgotMode(true)}
                className="text-sm text-brand hover:text-brand-hover transition-colors underline underline-offset-4"
              >
                Forgot password?
              </button>
              <p className="text-sm text-premium-textMuted">
                Super Admin: superadmin@awiaderp.com / admin123
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}