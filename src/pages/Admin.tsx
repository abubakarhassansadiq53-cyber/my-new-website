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
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, CalendarDays, Settings, LogOut, ChefHat } from 'lucide-react';

type Tab = 'overview' | 'menu' | 'chef_specials' | 'orders' | 'reservations' | 'settings';

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');

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
    <div className="min-h-screen bg-[#151313] text-white flex flex-col">
      {/* Header */}
      <header
        className="border-b border-white/10 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-40"
        style={{
          backgroundImage: 'url(https://i.imgur.com/JHfTvcb.png)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'left center',
          backgroundColor: 'rgba(26, 24, 24, 0.85)',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="flex items-center gap-3 pl-[180px] sm:pl-[200px]">
          <span className="font-label text-xs tracking-wider text-[#D89A27] hidden sm:inline">Admin Dashboard</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-white/60 hover:text-[#D89A27] text-sm font-label transition-colors"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <nav className="w-16 sm:w-56 bg-[#1a1818] border-r border-white/10 py-6 shrink-0">
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {activeTab === 'overview' && <AdminOverview onNavigate={setActiveTab} />}
          {activeTab === 'menu' && <AdminMenu />}
          {activeTab === 'chef_specials' && <AdminChefSpecials />}
          {activeTab === 'orders' && <AdminOrders />}
          {activeTab === 'reservations' && <AdminReservations />}
          {activeTab === 'settings' && <AdminSettings />}
        </main>
      </div>
    </div>
  );
}
