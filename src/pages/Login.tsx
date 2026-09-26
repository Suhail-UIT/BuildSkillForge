import React, { useState } from 'react';
import { Flame, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

interface LoginProps {
  onNavigateToRegister: () => void;
  onSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigateToRegister, onSuccess }) => {
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleFastLogin = async (key: string) => {
    setLoading(true);
    setError('');
    try {
      await demoLogin(key);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Fast login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900 space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 text-white shadow-md shadow-orange-500/20">
            <Flame className="h-6 w-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-3">
            Sign In to BuildSkillForge
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access your projects, Skill Passport, or business requirements
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@college.edu or name@business.com"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-orange-600 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-orange-500/20 hover:bg-orange-500 active:scale-98 disabled:opacity-50 transition-all"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Switcher Section */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 text-center mb-2.5">
            Instant Demo Logins (Evaluation Shortcuts)
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleFastLogin('student_aarav')}
              className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-left hover:border-orange-400 dark:border-slate-800 dark:bg-slate-850"
            >
              <div className="font-bold text-slate-900 dark:text-white text-[11px]">Aarav Sharma</div>
              <div className="text-[10px] text-orange-600 dark:text-orange-400">Student (Score 92)</div>
            </button>

            <button
              onClick={() => handleFastLogin('student_priya')}
              className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-left hover:border-orange-400 dark:border-slate-800 dark:bg-slate-850"
            >
              <div className="font-bold text-slate-900 dark:text-white text-[11px]">Priya Patel</div>
              <div className="text-[10px] text-orange-600 dark:text-orange-400">Student (AI Champ)</div>
            </button>

            <button
              onClick={() => handleFastLogin('business_cafe')}
              className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-left hover:border-orange-400 dark:border-slate-800 dark:bg-slate-850"
            >
              <div className="font-bold text-slate-900 dark:text-white text-[11px]">Bean & Brew Café</div>
              <div className="text-[10px] text-indigo-600 dark:text-indigo-400">Business Client</div>
            </button>

            <button
              onClick={() => handleFastLogin('admin')}
              className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-left hover:border-orange-400 dark:border-slate-800 dark:bg-slate-850"
            >
              <div className="font-bold text-slate-900 dark:text-white text-[11px]">Platform Admin</div>
              <div className="text-[10px] text-slate-500">Telemetry & Escrow</div>
            </button>
          </div>
        </div>

        {/* Footer link */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          Don&apos;t have an account yet?{' '}
          <button
            onClick={onNavigateToRegister}
            className="font-bold text-orange-600 dark:text-orange-400 hover:underline"
          >
            Create Free Account
          </button>
        </div>
      </div>
    </div>
  );
};
