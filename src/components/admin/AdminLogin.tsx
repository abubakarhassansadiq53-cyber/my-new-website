import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Lock, Mail, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#151313] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/ares-logo.png" alt="ARE" className="h-20 w-auto mx-auto mb-4 object-contain" />
          <h1 className="font-heading text-2xl font-bold text-[#D89A27]">Admin Dashboard</h1>
          <p className="text-white/40 text-sm mt-2">Sign in to manage your restaurant</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1a1818] rounded-2xl p-8 border border-white/10 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex gap-2 items-start">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-label tracking-wider text-white/50 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#151313] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:border-[#D89A27] focus:outline-none transition-colors"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-label tracking-wider text-white/50 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#151313] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:border-[#D89A27] focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D89A27] hover:bg-[#D89A27]/90 text-black font-label text-sm font-semibold tracking-wider py-3.5 rounded-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
