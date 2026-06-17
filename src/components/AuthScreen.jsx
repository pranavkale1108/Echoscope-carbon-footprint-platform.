import React, { useState } from 'react';
import { auth, isFirebaseConfigured } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { ShieldCheck, LogIn, UserPlus, AlertCircle, Sparkles } from 'lucide-react';

export default function AuthScreen({ onAuthSuccess, onBypassSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        // Create user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        onAuthSuccess(userCredential.user);
      } else {
        // Sign in
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        onAuthSuccess(userCredential.user);
      }
    } catch (err) {
      console.error(err);
      let friendlyError = 'Authentication failed. Please check your credentials.';
      if (err.code === 'auth/email-already-in-use') {
        friendlyError = 'This email is already registered.';
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        friendlyError = 'Invalid email or password.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyError = 'Please enter a valid email address.';
      }
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  const handleBypass = () => {
    onBypassSuccess({
      uid: 'EcoGuardian_Offline_UID',
      email: 'trial_user@echoscope.earth',
      displayName: 'Offline Guardian'
    });
  };

  return (
    <div className="max-w-md w-full mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-2 font-outfit uppercase">
          Echoscope
        </h1>
        <p className="text-xs text-slate-400 tracking-widest uppercase">
          Identity Verification
        </p>
      </div>

      <div className="glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 text-blue-400">
            {isRegister ? <UserPlus className="w-6 h-6" /> : <LogIn className="w-6 h-6" />}
          </div>
        </div>

        <h3 className="text-xl font-bold font-outfit text-slate-100 text-center mb-6">
          {isRegister ? 'Create Your Account' : 'Verify Your Identity'}
        </h3>

        {/* Error panel */}
        {error && (
          <div className="mb-5 bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl flex items-start gap-2.5 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth form or Bypass block based on config */}
        {!isFirebaseConfigured ? (
          <div className="space-y-6 pt-2">
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-xl text-xs leading-relaxed font-light">
              <span className="font-bold flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Firebase Credentials Missing
              </span>
              Email authentication is unavailable because your client-side environment variables are not configured. You can launch the trial instantly using sandbox bypass credentials.
            </div>

            <button
              onClick={handleBypass}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold tracking-wider uppercase text-xs rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <ShieldCheck className="w-4 h-4" />
              Sign In via Sandboxed Bypass
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                  Secure Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold tracking-wider uppercase text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98 mt-6"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isRegister ? (
                  <>
                    <UserPlus className="w-4 h-4" /> Sign Up
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" /> Sign In
                  </>
                )}
              </button>
            </form>

            {/* Toggle option */}
            <div className="text-center mt-6">
              <button
                onClick={() => setIsRegister(!isRegister)}
                disabled={loading}
                className="text-xs text-slate-400 hover:text-white underline font-light transition-colors"
              >
                {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center">
        {isFirebaseConfigured ? (
          <p className="text-[10px] text-slate-500">
            Secured with Google Firebase Authentication services.
          </p>
        ) : (
          <p className="text-[10px] text-slate-500">
            Running in developer simulation mode.
          </p>
        )}
      </div>
    </div>
  );
}
