import React, { useState } from 'react';
import { ShieldCheck, LogIn, UserPlus, AlertCircle } from 'lucide-react';

const BACKEND_URL = 'https://echoscope-backend.onrender.com/api';

export default function AuthScreen({ onAuthSuccess, onBypassSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (isRegister && !username)) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const body = isRegister
        ? { email, password, username }
        : { email, password };

      // Explicitly hitting the Render Backend
      const res = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        // Improved error capture from your Express backend
        throw new Error(data.message || data.error || 'Authentication failed. Please check your credentials.');
      }

      onAuthSuccess(data.user, data.token);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Connection to backend failed. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleBypass = () => {
    onBypassSuccess({
      id: 'mock_offline_user_id',
      email: 'trial_user@echoscope.earth',
      username: 'EcoGuardian',
      worldHealthScore: 50,
      totalCo2EmittedKg: 0
    });
  };

  return (
    <section className="max-w-md w-full mx-auto px-4 py-8 animate-fade-in" aria-labelledby="auth-title">
      <div className="text-center mb-8">
        <h1 id="auth-title" className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-2 font-outfit uppercase">
          Echoscope
        </h1>
        <p className="text-xs text-slate-400 tracking-widest uppercase">
          Identity Verification
        </p>
      </div>

      <div className="glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 text-blue-400">
            {isRegister ? <UserPlus className="w-6 h-6" aria-hidden="true" /> : <LogIn className="w-6 h-6" aria-hidden="true" />}
          </div>
        </div>

        <h2 className="text-xl font-bold font-outfit text-slate-100 text-center mb-6">
          {isRegister ? 'Create Your Account' : 'Verify Your Identity'}
        </h2>

        {/* Error panel */}
        {error && (
          <div role="alert" aria-live="assertive" className="mb-5 bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl flex items-start gap-2.5 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label htmlFor="username-input" className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                Username / Display Name
              </label>
              <input
                id="username-input"
                type="text"
                placeholder="EcoGuardian"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
              />
            </div>
          )}

          <div>
            <label htmlFor="email-input" className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
              Email Address
            </label>
            <input
              id="email-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="password-input" className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
              Secure Password
            </label>
            <input
              id="password-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold tracking-wider uppercase text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98 mt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isRegister ? (
              <>
                <UserPlus className="w-4 h-4" aria-hidden="true" /> Sign Up
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" aria-hidden="true" /> Sign In
              </>
            )}
          </button>
        </form>

        {/* Toggle option */}
        <div className="text-center mt-6">
          <button
            onClick={() => setIsRegister(!isRegister)}
            disabled={loading}
            className="text-xs text-slate-400 hover:text-white underline font-light transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink mx-4 text-[10px] text-slate-400 uppercase tracking-widest font-bold">Or</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        <button
          onClick={handleBypass}
          className="w-full py-3.5 bg-slate-900/60 hover:bg-slate-900 border border-white/5 text-amber-400 font-bold tracking-wider uppercase text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          <ShieldCheck className="w-4 h-4" aria-hidden="true" />
          Offline Demo Mode
        </button>
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center">
        <p className="text-[10px] text-slate-400">
          Secured with custom MongoDB & JWT authentication.
        </p>
      </div>
    </section>
  );
}