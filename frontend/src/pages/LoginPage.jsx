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
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-premium-dark dark:bg-premium-dark px-4">
      <div className="w-full max-w-md glass-modal p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-premium-accent dark:bg-premium-accent rounded-xl mb-4 shadow-premium">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <h1 className="section-title">Welcome back</h1>
          <p className="section-subtitle mt-2">Sign in to your Awiad ERP account</p>
          <button
            onClick={toggleTheme}
            className="mt-4 p-2.5 rounded-xl bg-white/10 dark:bg-premium-card/50 text-premium-textMuted dark:text-premium-textMuted hover:bg-white/20 dark:hover:bg-premium-card/70 transition-all"
            title="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-premium-error/10 dark:bg-premium-error/10 text-premium-error dark:text-premium-error text-sm border border-premium-error/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-premium-textMuted dark:text-premium-textMuted mb-2">
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
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-premium-textMuted dark:text-premium-textMuted mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-premium-textMuted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field pl-10"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              <>
                Sign In <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-premium-textMuted dark:text-premium-textMuted">
            Super Admin: superadmin@awiaderp.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}