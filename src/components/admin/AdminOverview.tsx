import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UtensilsCrossed, ShoppingBag, CalendarDays, TrendingUp, Plus, Clock, ArrowRight } from 'lucide-react';

type Tab = 'overview' | 'menu' | 'chef_specials' | 'orders' | 'reservations' | 'settings';

interface Props {
  onNavigate: (tab: Tab) => void;
}

export default function AdminOverview({ onNavigate }: Props) {
  const [stats, setStats] = useState({ totalMenu: 0, ordersToday: 0, pendingReservations: 0, totalOrders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const today = new Date().toISOString().slice(0, 10);

      const [menuRes, ordersTodayRes, reservationsRes, allOrdersRes] = await Promise.all([
        supabase.from('menu_items').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', `${today}T00:00:00`),
        supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        totalMenu: menuRes.count ?? 0,
        ordersToday: ordersTodayRes.count ?? 0,
        pendingReservations: reservationsRes.count ?? 0,
        totalOrders: allOrdersRes.count ?? 0,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Menu Items', value: stats.totalMenu, icon: UtensilsCrossed, color: '#D89A27' },
    { label: 'Orders Today', value: stats.ordersToday, icon: ShoppingBag, color: '#B9472E' },
    { label: 'Pending Reservations', value: stats.pendingReservations, icon: CalendarDays, color: '#25D366' },
    { label: 'Total Orders', value: stats.totalOrders, icon: TrendingUp, color: '#6366f1' },
  ];

  const actions: { label: string; tab: Tab; icon: React.ComponentType<{ className?: string }> }[] = [
    { label: 'Add New Dish', tab: 'menu', icon: Plus },
    { label: "View Today's Orders", tab: 'orders', icon: ShoppingBag },
    { label: 'View Reservations', tab: 'reservations', icon: CalendarDays },
    { label: 'Update Opening Hours', tab: 'settings', icon: Clock },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-white mb-6">Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-[#1a1818] rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${card.color}20` }}>
                <card.icon className="w-6 h-6" style={{ color: card.color }} />
              </div>
              {loading ? (
                <div className="h-8 w-12 bg-white/10 rounded animate-pulse" />
              ) : (
                <span className="font-heading text-3xl font-bold text-white">{card.value}</span>
              )}
            </div>
            <p className="text-white/50 text-sm font-label tracking-wide">{card.label}</p>
          </div>
        ))}
      </div>

      <h2 className="font-heading text-lg font-semibold text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => onNavigate(action.tab)}
            className="flex items-center gap-3 bg-[#1a1818] hover:bg-[#222020] rounded-2xl p-5 border border-white/10 hover:border-[#D89A27]/30 transition-all group text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-[#D89A27]/15 flex items-center justify-center shrink-0">
              <action.icon className="w-5 h-5 text-[#D89A27]" />
            </div>
            <span className="text-white/80 text-sm font-medium flex-1">{action.label}</span>
            <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-[#D89A27] transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
