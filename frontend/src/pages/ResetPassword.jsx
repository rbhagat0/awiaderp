import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';
import { Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      await api.post(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-premium-dark px-4">
        <div className="max-w-md w-full bg-premium-card/60 backdrop-blur-2xl border border-premium-border/50 shadow-premium-lg rounded-3xl p-8 md:p-12 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-premium-text mb-2">Password Reset Successful</h1>
          <p className="text-premium-textMuted mb-8">Your password has been updated successfully.</p>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary w-full py-3.5 flex justify-center items-center gap-2"
          >
            Sign In <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-premium-dark px-4">
      <div className="max-w-md w-full bg-premium-card/60 backdrop-blur-2xl border border-premium-border/50 shadow-premium-lg rounded-3xl p-8 md:p-12">
        <div className="flex justify-center mb-6">
          <svg
            className="w-12 h-12 text-brand"
            viewBox="0 0 230 64"
          >
            <rect width="64" height="64" rx="16" fill="url(#awiad-grad)" />
            <defs>
              <linearGradient id="awiad-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#3B82F6" />
                <stop offset="1" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
            <path d="M19 47 L32 17 L45 47" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="24.5" y="35" width="15" height="5.5" rx="2.75" fill="#fff" />
            <circle cx="32" cy="17" r="4" fill="#fff" />
            <circle cx="19" cy="47" r="3" fill="#fff" fillOpacity=".55" />
            <circle cx="45" cy="47" r="3" fill="#fff" fillOpacity=".55" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-premium-text tracking-tight mb-2">Reset Password</h1>
        <p className="text-sm text-premium-textMuted mb-8">Enter your new password below</p>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-start gap-3 text-left">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div>
            <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-2 ml-1">New Password</label>
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

          <div>
            <label className="block text-xs font-semibold text-premium-textMuted uppercase tracking-wider mb-2 ml-1">Confirm Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-premium-textMuted group-focus-within:text-brand transition-colors" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="input-field pl-12 pr-12 py-3.5 bg-premium-bg/50 backdrop-blur-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-premium-textMuted hover:text-premium-text transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 flex justify-center items-center gap-2 shadow-brand/20"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Resetting...</> : <>Reset Password <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="mt-6 text-center">
          <a href="/login" className="text-sm text-brand hover:text-brand-hover transition-colors">
            Remember your password? Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
