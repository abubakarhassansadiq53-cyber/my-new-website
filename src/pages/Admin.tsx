import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminOverview from '@/components/admin/AdminOverview';
import AdminMenu from '@/components/admin/AdminMenu';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminReservations from '@/components/admin/AdminReservations';
import AdminSettings from '@/components/admin/AdminSettings';
import AdminChefSpecials from '@/components/admin/AdminChefSpecials';
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, CalendarDays, Settings, LogOut, ChefHat, KeyRound, X } from 'lucide-react';

type Tab = 'overview' | 'menu' | 'chef_specials' | 'orders' | 'reservations' | 'settings';

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showResetPw, setShowResetPw] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#151313] flex items-center justify-center">
        <div className="text-[#D89A27] font-label text-sm tracking-wider animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return <AdminLogin />;
  }

  const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'chef_specials', label: 'Chef Specials', icon: ChefHat },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'reservations', label: 'Reservations', icon: CalendarDays },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#151313] text-white flex flex-col relative overflow-hidden">
      {/* Large transparent logo watermark background */}
      <div
        className="fixed inset-0 pointer-events-none flex items-center justify-center"
        style={{
          backgroundImage: 'url(https://i.imgur.com/JHfTvcb.png)',
          backgroundSize: '60%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          opacity: 0.06,
        }}
      />

      {/* Header */}
      <header className="border-b border-white/10 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-40 bg-[#151313]/90 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-[#D89A27]/40 shrink-0">
            <img src="https://i.imgur.com/JHfTvcb.png" alt="ARE" className="h-full w-full object-cover" />
          </div>
          <span className="font-label text-xs tracking-wider text-[#D89A27] hidden sm:inline">Admin Dashboard</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowResetPw(true)}
            className="flex items-center gap-2 text-white/60 hover:text-[#D89A27] text-sm font-label transition-colors"
          >
            <KeyRound className="w-4 h-4" /> <span className="hidden sm:inline">Reset Password</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/60 hover:text-[#D89A27] text-sm font-label transition-colors"
          >
            <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <nav className="w-16 sm:w-56 bg-[#1a1818]/90 backdrop-blur-sm border-r border-white/10 py-6 shrink-0">
          <div className="flex flex-col gap-1 px-2 sm:px-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#D89A27] text-black'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-5 h-5 shrink-0" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-auto relative">
          {activeTab === 'overview' && <AdminOverview onNavigate={setActiveTab} />}
          {activeTab === 'menu' && <AdminMenu />}
          {activeTab === 'chef_specials' && <AdminChefSpecials />}
          {activeTab === 'orders' && <AdminOrders />}
          {activeTab === 'reservations' && <AdminReservations />}
          {activeTab === 'settings' && <AdminSettings />}
        </main>
      </div>

      {/* Reset Password Modal */}
      {showResetPw && <ResetPasswordModal onClose={() => setShowResetPw(false)} />}
    </div>
  );
}

function ResetPasswordModal({ onClose }: { onClose: () => void }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (newPassword !== confirmPassword) {
      setMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setMsg({ type: 'error', text: error.message });
    } else {
      setMsg({ type: 'success', text: 'Password updated successfully.' });
      setNewPassword('');
      setConfirmPassword('');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4 py-8 overflow-y-auto" onClick={onClose}>
      <div className="bg-[#1a1818] rounded-2xl p-6 sm:p-8 max-w-md w-full my-auto border border-white/10" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-[#D89A27]" /> Reset Password
          </h3>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>

        {msg && (
          <div className={`rounded-xl p-3 mb-4 text-sm ${msg.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-label tracking-wider text-white/50 mb-2">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="admin-input" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-xs font-label tracking-wider text-white/50 mb-2">Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="admin-input" placeholder="•••••••••" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-[#D89A27] hover:bg-[#D89A27]/90 text-black font-label text-sm font-semibold tracking-wider py-3.5 rounded-lg transition-all disabled:opacity-60">
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
